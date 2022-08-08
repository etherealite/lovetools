export default class Location {
    constructor(locationId) {
        Object.defineProperty(this, 'id', {
            value: locationId, writable: false
        });
    }
    static get id() { return this.id }

    adjustments(variant) {
        client.query({

        })
    }

    static new(locationId) {

        return new this();
    }
}