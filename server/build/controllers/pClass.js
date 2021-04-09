"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.classWriteQuery = exports.classReadQuery = void 0;

var _pClass = _interopRequireDefault(require("../models/pClass"));

const classReadQuery = (req, classID = null) => {
  if (classID) {
    return {
      _id: classID,
      $or: [{
        ownerId: req.user.sub
      }, {
        readIds: req.user.sub
      }, {
        public: true
      }]
    };
  } else {
    return {
      $or: [{
        ownerId: req.user.sub
      }, {
        readIds: req.user.sub
      }, {
        public: true
      }]
    };
  }
};

exports.classReadQuery = classReadQuery;

const classWriteQuery = (req, classID = null) => {
  if (classID) {
    return {
      _id: classID,
      $or: [{
        ownerId: req.user.sub
      }, {
        writeIds: req.user.sub
      }]
    };
  } else {
    return {
      $or: [{
        ownerId: req.user.sub
      }, {
        writeIds: req.user.sub
      }]
    };
  }
};

exports.classWriteQuery = classWriteQuery;
var _default = {
  get: async (req, res) => {
    // query to get classes belonging to the user
    _pClass.default.find(classReadQuery(req), '-__v').then(classes => {
      // log and send back classes
      console.log(classes);
      res.json(classes);
    }).catch(err => {
      // on error send back error message or generic error message 
      res.status(500).send({
        message: err.message || "Some error occurred while getting classes."
      });
    });
  },
  create: async (req, res) => {
    let rClass;

    if (!req.body.pClass) {
      // if no pClass was actually sent, respond with error
      return res.status(400).send({
        message: "Class cannot be blank."
      });
    } else {
      // if pClass included in request, assign that to the variable
      const fullClass = req.body.pClass;
      const {
        public: publicStatus,
        ...cleanClass
      } = fullClass;
      rClass = cleanClass;
    } // get id


    rClass.ownerId = req.user.sub; // create new pClass model using schema

    const nClass = new _pClass.default({ ...rClass
    }); // attempt to save pClass

    nClass.save().then(pClassDoc => {
      const {
        __v,
        ...pClass
      } = pClassDoc.toObject(); // return newly created pClass to client
      // useful since client needs some of the properties assigned when creating the model (eg _id)

      res.json(pClass);
    }).catch(err => {
      // on error, return error message or generic error message
      res.status(500).send({
        message: err.message || "Some error occurred when creating the class, plase try again later."
      });
    });
  },
  getById: async (req, res, next) => {
    const pClassID = req.params.pClassID; // attempt to find a pClass with the specified ID which belongs to the requesting user

    _pClass.default.findOne(classReadQuery(req), '-__v').then(pClass => {
      // if no pClass was found throw an error
      if (!pClass) {
        const error = new Error("No Class with ID");
        error.kind = 'ObjectId';
        throw error;
      } // send retrieved pClass


      res.json(pClass);
    }).catch(err => {
      // handle errors
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "No class exists with id " + pClassID
        });
      }

      return res.status(500).send({
        message: "Error getting pClass with id " + pClassID
      });
    });
  },
  update: async (req, res) => {
    const pClassID = req.params.pClassID;
    let eClass;

    if (!req.body.pClass) {
      // if no pClass was actually sent, respond with error
      return res.status(400).send({
        message: "Class data cannot be blank."
      });
    } else {
      // if pClass included in request, assign that to the variable
      const fullClass = req.body.pClass;
      const {
        public: publicStatus,
        ...cleanClass
      } = fullClass;
      eClass = cleanClass;
    } // update pClass with given ID owned by the user
    // TODO - store ownerID as array of owners (maybe array of objs for permissions)


    await _pClass.default.findOne(classWriteQuery(req, pClassID)).then(async pClass => {
      if (!pClass) {
        throw new Error('No class exists with that ID');
      }

      pClass.set({ ...eClass
      });
      return await pClass.save();
    }).then(pClass => {
      console.log("Updated Class:\n" + pClass);
      res.json(pClass);
    }).catch(err => {
      // handle any errors
      // TODO - Write error handler in express to do this properly (somehow -_-)
      console.log(err);
      res.status(500).send({
        message: "Error getting class with id " + pClassID
      });
    });
  },
  delete: async (req, res, next) => {
    const pClassID = req.params.pClassID;

    _pClass.default.findOne(classWriteQuery(req, pClassID)).then(async pClass => {
      return await pClass.remove();
    }).then(pClass => {
      console.log("Deleted: ", pClass);
      res.status(204).end("Deleted Class");
    }).catch(err => {
      console.log(err);
      next(err);
    });
  },
  deleteAll: async (req, res, next) => {
    _pClass.default.find({
      ownerId: req.user.sub
    }).then(async classes => {
      classes.forEach(async pClass => {
        await pClass.remove();
      });
      res.status(200).end();
    }).catch(err => {
      console.log(err);
      next(err);
    });
  }
};
exports.default = _default;