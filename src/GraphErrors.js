export class GraphClientError extends Error {
    constructor(message) {
      super(message); // (1)
      this.name = "GraphClientException";
    }
}

export class HTTPResponseError extends Error {
	constructor(response, ...args) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
		this.response = response;
    this.name = 'HTTPResponseError'
	}
}