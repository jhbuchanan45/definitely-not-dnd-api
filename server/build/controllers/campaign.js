"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _campaign = _interopRequireDefault(require("../models/campaign"));

var _user = _interopRequireDefault(require("../models/user"));

// populate query
const populateQuery = [{
  path: 'players',
  select: 'name image classes.level race campaignId'
}, {
  path: 'lastMap',
  select: 'name image'
}];
var _default = {
  get: async (req, res) => {
    // query to get campaigns belonging to the user
    _campaign.default.find({}, '-__v').or([{
      ownerId: req.user.sub
    }, {
      readIds: req.user.sub
    }]).populate(populateQuery).exec().then(campaigns => {
      // send back campaigns
      res.json(campaigns);
    }).catch(err => {
      // on error send back error message or generic error message 
      res.status(500).send({
        message: err.message || "Error occurred while getting campaigns."
      });
    });
  },
  create: async (req, res) => {
    let rCampaign;

    if (!req.body.campaign) {
      // if no campaign was actually sent, respond with error
      return res.status(400).send({
        message: "Campaign cannot be blank."
      });
    } else {
      // if campaign included in request, assign that to the variable
      const fullCampaign = req.body.campaign;
      const {
        players,
        ...cleanCampaign
      } = fullCampaign;
      rCampaign = cleanCampaign;
    } // get id and set initial read/write permissions


    rCampaign.ownerId = req.user.sub; // create new campaign model using schema

    const nCampaign = new _campaign.default({ ...rCampaign
    });

    if (nCampaign.readIds.indexOf(req.user.sub) === -1) {
      nCampaign.readIds.push(req.user.sub);
    }

    ;

    if (nCampaign.writeIds.indexOf(req.user.sub) === -1) {
      nCampaign.writeIds.push(req.user.sub);
    }

    ; // attempt to save campaign

    await nCampaign.save().then(campaignDoc => {
      const {
        __v,
        ...campaign
      } = campaignDoc.toObject(); // return newly created campaign to client
      // useful since client needs some of the properties assigned when creating the model (eg _id)

      res.json(campaign);
    }).catch(err => {
      // on error, return error message or generic error message
      res.status(500).send({
        message: err.message || "Some error occurred when creating the Campaign, plase try again later."
      });
    });
  },
  getById: async (req, res, next) => {
    const campaignID = req.params.campaignID; // attempt to find a campaign with the specified ID which belongs to the requesting user

    _campaign.default.findOne({
      _id: campaignID,
      $or: [{
        ownerId: req.user.sub
      }, {
        readIds: req.user.sub
      }]
    }, '-__v').populate(populateQuery).exec().then(campaign => {
      // if no campaign was found throw an error
      if (!campaign) {
        const error = new Error("No campaign with ID");
        error.kind = 'ObjectId';
        throw error;
      } // send retrieved Campaign


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
      });
    });
  },
  update: async (req, res, next) => {
    const campaignID = req.params.campaignID;
    let eCampaign;

    if (!req.body.campaign) {
      // if no campaign was actually sent, respond with error
      return res.status(400).send({
        message: "Campaign data cannot be blank."
      });
    } else {
      // if campaign included in request, assign that to the variable
      const fullCampaign = req.body.campaign;
      const {
        players,
        ...cleanCampaign
      } = fullCampaign;
      eCampaign = cleanCampaign;
    } // update campaign with given ID if the user has write privileges


    await _campaign.default.findOne({
      _id: campaignID,
      $or: [{
        ownerId: req.user.sub
      }, {
        writeIds: req.user.sub
      }]
    }).then(async campaign => {
      if (!campaign) {
        throw new Error('No campaign exists with that ID');
      }

      campaign.set({ ...eCampaign
      });
      console.log("Updated Campaign:\n" + campaign);
      return await campaign.save();
    }).then(async campaign => {
      const user = await _user.default.findOne({
        ownerId: req.user.sub
      });
      user === null || user === void 0 ? void 0 : user.set({
        lastCampaign: campaign._id
      });
      await (user === null || user === void 0 ? void 0 : user.save());
      return campaign;
    }).then(campaign => {
      res.json(campaign);
    }).catch(err => {
      // handle any errors
      // TODO - Write error handler in express to do this properly (somehow -_-)
      console.log(err);
      res.status(500).send({
        message: "Error getting campaign with id " + campaignID
      });
    });
  },
  delete: async (req, res, next) => {
    const campaignID = req.params.campaignID;

    _campaign.default.findOne({
      _id: campaignID,
      $or: [{
        ownerId: req.user.sub
      }, {
        writeIds: req.user.sub
      }]
    }).then(async campaign => {
      return await (campaign === null || campaign === void 0 ? void 0 : campaign.remove());
    }).then(() => {
      console.log("Deleted campaign");
      res.status(204).end("Deleted Campaign");
    }).catch(err => {
      console.log(err);
      next(err);
    });
  },
  deleteAll: async (req, res, next) => {
    _campaign.default.find({
      ownerId: req.user.sub
    }).then(async campaigns => {
      campaigns.forEach(async campaign => {
        await campaign.remove();
      });
      res.status(200).end();
    }).catch(err => {
      console.log(err);
      next(err);
    });
  }
};
exports.default = _default;