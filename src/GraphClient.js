import {HTTPResponseError, GraphClientError} from './GraphErrors.js';

export default class GraphClient {
    constructor(queries, fetch, requestParams) {
        this.queries = queries;
        this.fetch = fetch
        this.requestParams = requestParams;
    }

    async paginatedQuery(queryDefinition, pageMapper) {
        const {
            query,
            parameters,
        } = queryDefinition;


        const pages = [];
        for (let i = 0; i <= 50; i++) {
            const {data: firstPage} = await this.query(query, parameters);
            pages.push(firstPage);
            let cursor;
            let pageInfo;
            ({cursor, pageInfo} = pageMapper(firstPage));
            if (! cursor) {
                throw new GraphClientError('query result hasNextPage but has falsey value for the cursor')
            }
            if (!pageInfo.hasNextPage) {
                break;
            }

            let page = await this.query(query, {
                ...parameters,
                after: cursor,
            });

            pages.push(page);
        }
        return pages;
    }

    async query(queryString, options) {
        const rawResponsePromise = this.sendRequest(queryString, options);
        const postFlight = await this.processPostFlight(rawResponsePromise, {queryString, options})
        const {resultData} = postFlight;
        return resultData;
    }

    queryRaw(queryString, options) {
        this.sendRequest(queryString, options)
    }

    async sendRequest(queryString, options) {
        const fetch = this.fetch;
        const {
            queryEndpoint,
            fetchOptions,
         } = this.requestParams;

        const body = {
            operationName: options.operationName,
            query: queryString,
            variables: options.variables,
        };

        const requestOpts = {
            ...fetchOptions,
            body: JSON.stringify(body)
        }

        let rawResponse;
        try {
            rawResponse = await fetch(queryEndpoint, requestOpts);
        } catch(error) {
            throw error;
        }

        if (rawResponse.ok) {
            // response.status >= 200 && response.status < 300
            return rawResponse;
        } else {
            throw new HTTPResponseError(rawResponse);
        }
    }

    async processPostFlight(rawResponsePromise, sourceQuery) {
        const rawResponse = await rawResponsePromise;
        const bodyJson = await rawResponse.json();

        const {
            queryString,
            operationName,
            variables
         } = sourceQuery;

        return {
            rawResponse,
            resultData: bodyJson,
            source: {
                query: queryString,
                parameters: {
                    operationName: operationName,
                    variables: variables,
                }
            }
        };
    }

}