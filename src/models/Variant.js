export default class Variant {
    constructor(variantId) {
        Object.defineProperty(this, 'id', {
            value: variantId, writable: false
        });
    }
}