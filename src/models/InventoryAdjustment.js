/**
 * Sample node from a query results on this type of object
 *                 {
                    "node": {
                        "id": "gid:\/\/shopify\/InventoryAdjustmentGroup\/13877973909527",
                        "createdAt": "2022-08-03T16:09:10Z",
                        "reason": "Manually adjusted",
                        "staffMember": null,
                        "app": {
                            "id": "gid:\/\/shopify\/App\/1816153",
                            "title": "Multi Store Sync Power",
                            "__typename": "App"
                        },
                        "referenceDocumentObject": null,
                        "changes": [
                            {
                                "name": "available",
                                "quantityAfterChange": 204,
                                "delta": 1,
                                "__typename": "InventoryChange"
                            }
                        ],
                        "__typename": "InventoryAdjustmentGroup"
                    },
                    "cursor": "eyJsYXN0X2lkIjoxMzg3Nzk3MzkwOTUyNywibGFzdF92YWx1ZSI6IjIwMjItMDgtMDMgMTY6MDk6MTAuMjMwMTE0In0=",
                    "__typename": "InventoryAdjustmentGroupEdge"
                },
 */

export default class InventoryAdjustment {
    constructor(
        adjustment_id,
        createdAt,
        reason,
        staffMember,
        app,
        referenceDocumentObject,
        changes,
    ) {

        /**
         * an adjustment id looks like this
         *     "id": "gid:\/\/shopify\/InventoryAdjustmentGroup\/13877973909527",
         */
        Object.defineProperty(this, 'id', {
            value: adjustment_id, writable: false
        });

        this.createdAt = createdAt
        this.reason = reason
        this.staffMember = staffMember
        this.app = app
        this.referenceDocumentObject = referenceDocumentObject
        this.changes = changes
    }
}