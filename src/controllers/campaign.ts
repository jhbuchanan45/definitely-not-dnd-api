import Campaign from '../models/campaign';

export default {
    get: async (req: any, res: any) => {

        // query to get campaigns belonging to the user
        Campaign.find().or([{ ownerId: req.user.sub }, { players: req.user.sub }]).exec()
            .then(campaigns => {

                // log and send back campaigns
                console.log(campaigns);
                res.json(campaigns)

            }).catch(err => {

                // on error send back error message or generic error message 
                res.status(500).send({
                    message: err.message || "Some error occurred while getting campaigns."
                })

            })
    },

    create: async (req: any, res: any) => {
        let rCampaign;

        if (!req.body.campaign) {

            // if no campaign was actually sent, respond with error
            return res.status(400).send({
                message: "Campaign cannot be blank."
            })

        } else {

            // if campaign included in request, assign that to the variable
            rCampaign = req.body.campaign;

        }

        // get id
        rCampaign.ownerId = req.user.sub;

        // create new campaign model using schema
        const nCampaign = new Campaign({ ...rCampaign })

        // attempt to save campaign
        nCampaign.save()
            .then(campaign => {

                // return newly created campaign to client
                // useful since client needs some of the properties assigned when creating the model (eg _id)
                res.json(campaign);

            }).catch(err => {

                // on error, return error message or generic error message
                res.status(500).send({
                    message: err.message || "Some error occurred when creating the Campaign, plase try again later."
                });

            });
    },

    getById: async (req: any, res: any, next: any) => {
        const campaignID = req.params.campaignID;

        // attempt to find a campaign with the specified ID which belongs to the requesting user
        Campaign.findOne({ _id: campaignID, ownerId: req.user.sub })
            .then(campaign => {

                // if no campaign was found throw an error
                if (!campaign) {
                    const error: any = new Error("No campaign with ID");
                    error.kind = 'ObjectId';
                    throw error;
                }

                // send retrieved Campaign
                res.json(campaign);

            }).catch(err => {

                // handle errors
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "No campaign exists with id " + campaignID
                    });
                }

                return res.status(500).send({
                    message: "Error getting campaign with id " + campaignID
                })
            })
    },

    update: async (req: any, res: any, next: any) => {
        const campaignID = req.params.campaignID;
        let eCampaign;

        if (!req.body.campaign) {

            // if no campaign was actually sent, respond with error
            return res.status(400).send({
                message: "campaign data cannot be blank."
            })

        } else {

            // if campaign included in request, assign that to the variable
            eCampaign = req.body.campaign;

        }

        // update campaign with given ID owned by the user
        // TODO - store ownerID as array of owners (maybe array of objs for permissions)
        Campaign.findOneAndUpdate({ _id: campaignID, ownerId: req.user.sub }, { ...eCampaign }, { new: true })
            .then(campaign => {

                // return updated campaign ({new: true} query option ensures updated campaign not old is passed here)
                console.log("Updated Campaign:\n" + campaign);
                res.json(campaign);

            }).catch(err => {

                // handle any errors
                // TODO - Write error handler in express to do this properly (somehow -_-)
                console.log(err);
                res.status(500).send({
                    message: "Error getting campaign with id " + campaignID
                })

            })

    },

    delete: async (req: any, res: any, next: any) => {
        const campaignID = req.params.campaignID;

        Campaign.findOneAndDelete({ _id: campaignID, ownerId: req.user.sub })
            .then((campaign) => {
                console.log("Deleted: ", campaign)
                res.status(204).end("Deleted Campaign")
            })
            .catch(err => {
                console.log(err);
                next(err);
            })
    },

    deleteAll: async (req: any, res: any, next: any) => {
        Campaign.deleteMany({ ownerId: req.user.sub })
            .then(() => {
                res.status(200).end();
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
    },

    getByIDs: async (req: any, res: any, next: any) => {
        const campaignIds = req.body.IDs;

        Campaign.find({ _id: { $in: [...campaignIds] } })
            .then((campaigns) => {
                console.log(campaigns)
                res.json(campaigns)
            })
            .catch(err => {
                console.log(err);
                next(err);
            })
    }
}