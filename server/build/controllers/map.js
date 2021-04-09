"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("../models/map"));

var _default = {
  get: async (req, res) => {
    // query to get maps belonging to the user
    _map.default.find({
      campaignId: req.params.campaignId
    }, '-__v').or([{
      ownerId: req.user.sub
    }, {
      readIds: req.user.sub
    }]).exec().then(maps => {
      // log and send back maps
      console.log(maps);
      res.json(maps);
    }).catch(err => {
      // on error send back error message or generic error message 
      res.status(500).send({
        message: err.message || "Some error occurred while getting maps."
      });
    });
  },
  create: async (req, res) => {
    let rMap;

    if (!req.body.map) {
      // if no map was actually sent, respond with error
      return res.status(400).send({
        message: "MapInfo cannot be blank."
      });
    } else {
      // if map included in request, assign that to the variable
      const fullMap = req.body.map;
      const {
        readIds,
        writeIds,
        ...cleanMap
      } = fullMap;
      rMap = cleanMap;
    } // get id


    rMap.ownerId = req.user.sub; // create new map model using schema

    const nMap = new _map.default({ ...rMap
    }); // attempt to save map

    nMap.save().then(mapDoc => {
      const {
        __v,
        ...map
      } = mapDoc.toObject(); // return newly created map to client
      // useful since client needs some of the properties assigned when creating the model (eg _id)

      res.json(map);
    }).catch(err => {
      // on error, return error message or generic error message
      res.status(500).send({
        message: err.message || "Some error occurred when creating the map, plase try again later."
      });
    });
  },
  getById: async (req, res, next) => {
    const mapID = req.params.mapID; // attempt to find a map with the specified ID which belongs to the requesting user

    _map.default.findOne({
      _id: mapID,
      $or: [{
        ownerId: req.user.sub
      }, {
        readIds: req.user.sub
      }]
    }, '-__v').then(map => {
      // if no map was found throw an error
      if (!map) {
        const error = new Error("No map with ID");
        error.kind = 'ObjectId';
        throw error;
      } // send retrieved map


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
      });
    });
  },
  update: async (req, res, next) => {
    const mapID = req.params.mapID;
    let eMap;

    if (!req.body.map) {
      // if no map was actually sent, respond with error
      return res.status(400).send({
        message: "MapInfo data cannot be blank."
      });
    } else {
      // if map included in request, assign that to the variable
      const fullMap = req.body.map;
      const {
        readIds,
        writeIds,
        ...cleanMap
      } = fullMap;
      eMap = cleanMap;
    } // update map with given ID owned by the user
    // TODO - store ownerID as array of owners (maybe array of objs for permissions)


    await _map.default.findOne({
      _id: mapID,
      $or: [{
        ownerId: req.user.sub
      }, {
        writeIds: req.user.sub
      }]
    }).then(async map => {
      if (!map) {
        throw new Error('No map exists with that ID');
      }

      map.set({ ...eMap
      });
      return await map.save();
    }).then(map => {
      console.log("Updated map:\n" + map);
      res.json(map);
    }).catch(err => {
      // handle any errors
      // TODO - Write error handler in express to do this properly (somehow -_-)
      console.log(err);
      res.status(500).send({
        message: "Error getting map with id " + mapID
      });
    });
  },
  delete: async (req, res, next) => {
    const mapID = req.params.mapID;

    _map.default.findOne({
      _id: mapID,
      $or: [{
        ownerId: req.user.sub
      }, {
        writeIds: req.user.sub
      }]
    }).then(async map => {
      return await map.remove();
    }).then(map => {
      console.log("Deleted: ", map);
      res.status(204).end("Deleted MapInfo");
    }).catch(err => {
      console.log(err);
      next(err);
    });
  },
  deleteAll: async (req, res, next) => {
    _map.default.find({
      ownerId: req.user.sub
    }).then(async maps => {
      maps.forEach(async map => {
        await map.remove();
      });
      res.status(200).end();
    }).catch(err => {
      console.log(err);
      next(err);
    });
  }
};
exports.default = _default;