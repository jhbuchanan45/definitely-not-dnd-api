import User from '../models/user';

export default {
    get: async (req: any, res: any) => {

        const qOptions = { upsert: true, new: true, setDefaultsOnInsert: true };

        User.findOneAndUpdate({ ownerId: req.user.sub }, { ownerId: req.user.sub }, qOptions)
            .then(user => {
                // return newly created/ found user to client
                console.log(user)
                res.json(user);

            }).catch(err => {

                // on error, return error message or generic error message
                res.status(500).send({
                    message: err.message || "An error occurred saving user settings, please try again later."
                });
            });
    },

    create: async (req: any, res: any) => {
        let rUser;

        if (!req.body.user) {

            // if no user was actually sent, respond with error
            return res.status(400).send({
                message: "User details cannot be blank."
            })

        } else {

            // if user included in request, assign that to the variable
            rUser = req.body.user;

            // ensure ownerId isn't modified
            rUser.ownerId = req.user.sub;
        }

        const qOptions = { upsert: true, new: true, setDefaultsOnInsert: true };

        User.findOneAndUpdate({ ownerId: rUser.ownerId }, { ...rUser }, qOptions)
            .then(user => {
                // return newly created/updated user to client

                res.json(user);

            }).catch(err => {

                // on error, return error message or generic error message
                res.status(500).send({
                    message: err.message || "An error occurred saving user settings, please try again later."
                });
            });
    },

    // unneeded? - no, will be used for querying to check player ids
    getById: async (req: any, res: any, next: any) => {
        const userID = req.params.userID;

        // attempt to find a user with the specified ID which belongs to the requesting user
        User.findOne({ _id: userID, ownerId: req.user.sub })
            .then(user => {

                // if no user was found throw an error
                if (!user) {
                    const error: any = new Error("No user with ID");
                    error.kind = 'ObjectId';
                    throw error;
                }

                // send retrieved User
                res.json(user);

            }).catch(err => {

                // handle errors
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "No user exists with id " + userID
                    });
                }

                return res.status(500).send({
                    message: "Error getting user with id " + userID
                })
            })
    },

    update: async (req: any, res: any, next: any) => {
        const userID = req.params.userID;
        let eUser;

        if (!req.body.user) {

            // if no user was actually sent, respond with error
            return res.status(400).send({
                message: "user data cannot be blank."
            })

        } else {

            // if user included in request, assign that to the variable
            eUser = req.body.user;

            // ensure ownerId isn't modified
            eUser.ownerId = req.user.sub;

        }

        const qOptions = { upsert: true, new: true, setDefaultsOnInsert: true };

        User.findOneAndUpdate({ ownerId: eUser.ownerId }, { ...eUser }, qOptions)
            .then(user => {
                // return newly created/updated user to client

                res.json(user);

            }).catch(err => {

                // on error, return error message or generic error message
                res.status(500).send({
                    message: err.message || "An error occurred saving user settings, please try again later."
                });
            });

    },

    delete: async (req: any, res: any, next: any) => {
        const userID = req.params.userID;

        User.findOneAndDelete({ _id: userID, ownerId: req.user.sub })
            .then((user) => {
                console.log("Deleted: ", user)
                res.status(204).end("Deleted User")
            })
            .catch(err => {
                console.log(err);
                next(err);
            })
    },

    deleteAll: async (req: any, res: any, next: any) => {
        User.deleteMany({ ownerId: req.user.sub })
            .then(() => {
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
    }
}