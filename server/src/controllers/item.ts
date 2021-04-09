import { getWritePermissions } from '../middlewares/getPermissions';
import { defaultSafeReadQuery, defaultSafeWriteQuery } from '../middlewares/rolePermissionsControl';
import Item from '../models/item';

export const itemReadQuery = (req, itemID=null) => defaultSafeReadQuery(req, itemID, false);
export const itemWriteQuery = (req, itemID=null) => defaultSafeWriteQuery(req, itemID, false);

export default {
    get: async (req: any, res: any) => {
        let itemQuery: any = defaultSafeReadQuery(req, null, false);

        if (req.query.src || req.query.ownerId) {
            const { src, ownerId } = req.query;
            itemQuery.src = src ? src : undefined;
            itemQuery.ownerId = ownerId ? ownerId : undefined;
        }

        // query to get items belonging to the user
        Item.find(itemQuery, '-__v')
            .then(items => {

                // log and send back items
                console.log(items);
                res.json(items)

            }).catch(err => {

                // on error send back error message or generic error message 
                res.status(500).send({
                    message: err.message || "Some error occurred while getting items."
                })

            })
    },

    create: async (req: any, res: any) => {
        let rItem;

        const writeContentPerms = getWritePermissions(req.user.permissions);

        if (!req.body.item) {

            // if no item was actually sent, respond with error
            return res.status(400).send({
                message: "Item cannot be blank."
            })

        } else {

            // if item included in request, assign that to the variable
            const fullItem: any = req.body.item

            const { readIds, writeIds, src, ...cleanItem } = fullItem;
            rItem = cleanItem;

            if (writeContentPerms.includes(src) || req.user.permissions.includes("admin")) {
                rItem.src = src;
            }
        }

        // get id
        rItem.ownerId = req.user.sub;

        // create new item model using schema
        const nItem = new Item({ ...rItem })

        // attempt to save item
        nItem.save()
            .then(itemDoc => {

                const { __v, ...item } = itemDoc.toObject();
                // return newly created item to client
                // useful since client needs some of the properties assigned when creating the model (eg _id)
                res.json(item);

            }).catch(err => {

                // on error, return error message or generic error message
                res.status(500).send({
                    message: err.message || "Some error occurred when creating the item, plase try again later."
                });

            });
    },

    getById: async (req: any, res: any, next: any) => {
        const itemID = req.params.itemID;

        // attempt to find a item with the specified ID which belongs to the requesting user
        Item.findOne(defaultSafeReadQuery(req, itemID), '-__v')
            .then(item => {

                // if no item was found throw an error
                if (!item) {
                    const error: any = new Error("No item with ID");
                    error.kind = 'ObjectId';
                    throw error;
                }

                // send retrieved item
                res.json(item);

            }).catch(err => {

                // handle errors
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "No item exists with id " + itemID
                    });
                }

                return res.status(500).send({
                    message: "Error getting item with id " + itemID
                })
            })
    },

    update: async (req: any, res: any, next: any) => {
        const itemID = req.params.itemID;
        let eItem;
        let reqSrc;

        const writeContentPerms = getWritePermissions(req.user.permissions);

        if (!req.body.item) {

            // if no item was actually sent, respond with error
            return res.status(400).send({
                message: "Item data cannot be blank."
            })

        } else {

            // if item included in request, assign that to the variable
            const fullItem: any = req.body.item

            const { readIds, writeIds, src, ...cleanItem } = fullItem;
            eItem = cleanItem;
            reqSrc = src
        }

        // update item with given ID owned by the user
        // TODO - store ownerID as array of owners (maybe array of objs for permissions)
        await Item.findOne(defaultSafeWriteQuery(req, itemID))
            .then(async (item) => {
                if (!item) {
                    throw new Error('No item exists with that ID')
                }
                // if both existing and new src can be written to by the user
                if (writeContentPerms.includes(reqSrc) || req.user.permissions.includes("admin")) {
                    eItem.src = reqSrc;
                } else {
                    eItem.src = "homebrew";
                }

                item.set({ ...eItem });

                return await item.save();
            })
            .then(item => {

                console.log("Updated item:\n" + item);
                res.json(item);
            })
            .catch(err => {

                // handle any errors
                // TODO - Write error handler in express to do this properly (somehow -_-)
                console.log(err);
                res.status(500).send({
                    message: "Error getting item with id " + itemID
                })
                next(err);
            })

    },

    delete: async (req: any, res: any, next: any) => {
        const itemID = req.params.itemID;

        Item.findOne(defaultSafeWriteQuery(req, itemID))
            .then(async (item: any) => {
                return await item.remove()
            })
            .then((item) => {
                console.log("Deleted: ", item)
                res.status(204).end("Deleted Item")
            })
            .catch(err => {
                console.log(err);
                next(err);
            })
    },

    deleteAll: async (req: any, res: any, next: any) => {
        Item.find({ ownerId: req.user.sub })
            .then(async (items) => {
                items.forEach(async (item) => { await item.remove() })
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
    }
}