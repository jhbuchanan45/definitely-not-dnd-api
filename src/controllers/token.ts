import { Model } from 'mongoose';

// to avoid boilerplate for very similar token controllers, each route will 
// 'generate' the functions by passing the required model

export const generateTokenTypes = (Token: Model<any>) => {

    return {
        get: async (req: any, res: any) => {

            // query to get tokens belonging to the user
            Token.find({ campaignId: req.params.campaignId }, '-__v').or([{ ownerId: req.user.sub }, { readIds: req.user.sub }]).exec()
                .then(tokens => {

                    // log and send back tokens
                    console.log(tokens);
                    res.json(tokens)

                }).catch(err => {

                    // on error send back error message or generic error message 
                    res.status(500).send({
                        message: err.message || "Some error occurred while getting tokens. (Check campaign ID)"
                    })

                })

        },

        create: async (req: any, res: any) => {
            let rToken;

            if (!req.body.token) {

                // if no token was actually sent, respond with error
                return res.status(400).send({
                    message: "Token cannot be blank."
                })

            } else {

                // if token included in request, assign that to the variable
                const fullToken: any = req.body.token
                console.log("hey from create before cleaning")
                const { readIds, writeIds, ...cleanToken } = fullToken;
                rToken = cleanToken;
            }

            // get id
            rToken.ownerId = req.user.sub;

            // create new token model using schema
            const nToken = new Token({ ...rToken })

            // attempt to save token
            nToken.save()
                .then(tokenDoc => {

                    const { __v, ...token }: any = tokenDoc.toObject()
                    // return newly created token to client
                    // useful since client needs some of the properties assigned when creating the model (eg _id)
                    res.json(token);
                })
                .catch(err => {

                    // on error, return error message or generic error message
                    res.status(500).send({
                        message: err.message || "Some error occurred when creating the token, plase try again later."
                    });

                });
        },

        getById: async (req: any, res: any, next: any) => {
            const tokenID = req.params.tokenID;

            // attempt to find a token with the specified ID which belongs to the requesting user
            Token.findOne({ _id: tokenID, $or: [{ ownerId: req.user.sub }, { readIds: req.user.sub }] }, '-__v')
                .then(token => {

                    // if no token was found throw an error
                    if (!token) {
                        const error: any = new Error("No token with ID");
                        error.kind = 'ObjectId';
                        throw error;
                    }

                    // send retrieved token
                    res.json(token);

                }).catch(err => {

                    // handle errors
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "No token exists with id " + tokenID
                        });
                    }

                    return res.status(500).send({
                        message: "Error getting token with id " + tokenID
                    })
                })
        },

        update: async (req: any, res: any, next: any) => {
            const tokenID = req.params.tokenID;
            let eToken;

            if (!req.body.token) {

                // if no token was actually sent, respond with error
                return res.status(400).send({
                    message: "Token data cannot be blank."
                })

            } else {

                // if token included in request, assign that to the variable
                const fullToken: any = req.body.token
                const { readIds, writeIds, campaignId, ...cleanToken } = fullToken;
                eToken = cleanToken;

            }

            // update token with given ID owned by the user
            // TODO - store ownerID as array of owners (maybe array of objs for permissions)
            await Token.findOne({ _id: tokenID, $or: [{ ownerId: req.user.sub }, { writeIds: req.user.sub }] })
                .then(async (token) => {
                    if (!token) {
                        throw new Error('No token exists with that ID')
                    }

                    token.set({ ...eToken });

                    return await token.save();
                })
                .then(token => {
                    // return updated token ({new: true} query option ensures updated token not old is passed here)
                    console.log("Updated token:\n" + token);
                    res.json(token);
                })
                .catch(err => {

                    // handle any errors
                    // TODO - Write error handler in express to do this properly (somehow -_-)
                    console.log(err);
                    res.status(500).send({
                        message: "Error getting token with id " + tokenID
                    })
                })

        },

        delete: async (req: any, res: any, next: any) => {
            const tokenID = req.params.tokenID;

            Token.findOne({ _id: tokenID, $or: [{ ownerId: req.user.sub }, { writeIds: req.user.sub }] })
                .then(async (token) => {
                    return await token.remove();
                })
                .then(token => {
                    console.log("Deleted: ", token)
                    res.status(204).end("Deleted Token")
                })
                .catch(err => {
                    console.log(err);
                    next(err);
                })
        },

        deleteAll: async (req: any, res: any, next: any) => {
            Token.find({ ownerId: req.user.sub })
                .then(async (tokens) => {
                    tokens.forEach(async (token) => { await token.remove() })
                    res.status(200).end();
                })
                .catch((err) => {
                    console.log(err);
                    next(err);
                })
        }
    }
}