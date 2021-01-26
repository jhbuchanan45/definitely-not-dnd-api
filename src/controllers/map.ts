import Map from '../models/map';

export default {
    get: async (req: any, res: any) => {

        // query to get maps belonging to the user
        Map.find({ ownerId: req.user.sub }).exec()
            .then(maps => {

                // log and send back maps
                console.log(maps);
                res.json(maps)

            }).catch(err => {

                // on error send back error message or generic error message 
                res.status(500).send({
                    message: err.message || "Some error occurred while getting maps."
                })

            })
    },

    create: async (req: any, res: any) => {
        let rMap;

        if (!req.body.map) {

            // if no map was actually sent, respond with error
            return res.status(400).send({
                message: "Map cannot be blank."
            })

        } else {

            // if map included in request, assign that to the variable
            rMap = req.body.map;

        }

        // get id
        rMap.ownerId = req.user.sub;

        // create new map model using schema
        const nMap = new Map({ ...rMap })

        // attempt to save map
        nMap.save()
            .then(map => {

                // return newly created map to client
                // useful since client needs some of the properties assigned when creating the model (eg _id)
                res.json(map);

            }).catch(err => {

                // on error, return error message or generic error message
                res.status(500).send({
                    message: err.message || "Some error occurred when creating the map, plase try again later."
                });

            });
    },

    getById: async (req: any, res: any, next: any) => {
        const mapID = req.params.mapID;

        // attempt to find a map with the specified ID which belongs to the requesting user
        Map.findOne({ _id: mapID, ownerId: req.user.sub })
            .then(map => {

                // if no map was found throw an error
                if (!map) {
                    const error: any = new Error("No map with ID");
                    error.kind = 'ObjectId';
                    throw error;
                }

                // send retrieved map
                res.json(map);

            }).catch(err => {

                // handle errors
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "No map exists with id " + mapID
                    });
                }

                return res.status(500).send({
                    message: "Error getting map with id " + mapID
                })
            })
    },

    update: async (req: any, res: any, next: any) => {
        const mapID = req.params.mapID;
        let eMap;

        if (!req.body.map) {

            // if no map was actually sent, respond with error
            return res.status(400).send({
                message: "Map data cannot be blank."
            })

        } else {

            // if map included in request, assign that to the variable
            eMap = req.body.map;

        }

        // update map with given ID owned by the user
        // TODO - store ownerID as array of owners (maybe array of objs for permissions)
        Map.findOneAndUpdate({ _id: mapID, ownerId: req.user.sub }, { ...eMap }, { new: true })
            .then(map => {

                // return updated map ({new: true} query option ensures updated map not old is passed here)
                console.log("Updated map:\n" + map);
                res.json(map);

            }).catch(err => {

                // handle any errors
                // TODO - Write error handler in express to do this properly (somehow -_-)
                console.log(err);
                res.status(500).send({
                    message: "Error getting map with id " + mapID
                })

            })

    },

    delete: async (req: any, res: any, next: any) => {
        const mapID = req.params.mapID;

        try {
            const map = await Map.findByIdAndDelete(mapID, {}, (err, docs) => {
                if (err) {
                    console.log(err);
                    next(err);
                }
                else {
                    console.log("Deleted: ", docs);
                    res.status(204).end("Deleted Map");
                }
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    deleteAll: async (req: any, res: any, next: any) => {
        Map.deleteMany({ownerId: req.user.sub})
        .then(() => {
            res.status(200).end();
        })
        .catch((err) => {
            console.log(err);
            next(err);
        })
    }
}