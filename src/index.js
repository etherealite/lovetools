import fetch from 'node-fetch';
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createRequire } from "module";

import GraphClient from './GraphClient.js';
import Location from './models/Location.js';
import Variant from './models/Variant.js';

const projectDir = new URL(
        new URL('../', import.meta.url)
);

const dataDir = new URL('data/', projectDir)
const configDir = new URL('config/', projectDir);

const graphQlQueryDir = new URL('graphql/', import.meta.url)

const requestParams = JSON.parse(
    readFileSync(
        new URL('requestParams.json', dataDir),
        'utf8'
    )
)

const config = {
    graphClient: {
        graphQlQueryDir,
        requestParams,
    }
}

const makeGClient = (config) => {
    const graphQlQueryDir = config.graphQlQueryDir
    const queries = {
        shopify: {
            queries: {
                InventoryAdjustments: readFileSync(
                    new URL('./InventoryAdjustments.gql', graphQlQueryDir),
                    'utf8'
                ),
            },
            mutations: {},
        }
    };

    const requestParams = config.requestParams;
    return new GraphClient(queries, fetch, requestParams);
}

const graphClient = makeGClient(config.graphClient);



// /** copy request params from a fetch copied from chrome dev tools */
// const RequestParamsFromPaste = () => {
//     // TODO
// }


const location = new Location('gid://shopify/Location/69440372994')

const variant = new Variant('gid://shopify/ProductVariant/42898751127810');

const shopifyQueries = graphClient.queries.shopify.queries;


const pageMapper = (data) => {
    return {
        cursor: data.inventoryHistory.edges.slice(-1)[0].cursor,
        pageInfo: {
            hasNextPage: data.hasNextPage,
        }
    }
}

const stuff = await graphClient.paginatedQuery({
    query: shopifyQueries.InventoryAdjustments,
    parameters: {
        operationName: "InventoryAdjustments",
        variables: {
            after: null,
            first: 50,
            locationId: location.id,
            variantId: variant.id,
        }
    }
}, pageMapper);

stuff


// const res = await graphClient.query(shopifyQueries.InventoryAdjustments, {
//     operationName: "InventoryAdjustments",
//     variables: {
//         after: null,
//         first: 50,
//         locationId: location.id,
//         variantId: variant.id,
//     }
// });

// res;