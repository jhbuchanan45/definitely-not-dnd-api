"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultSafeWriteQuery = exports.defaultSafeReadQuery = void 0;

var _getPermissions = require("./getPermissions");

const defaultSafeReadQuery = (req, objID = null, adminOverride = true) => {
  const userContentPerms = (0, _getPermissions.getReadPermissions)(req.user.permissions);
  return req.user.permissions.includes('admin') && adminOverride ? {
    _id: objID
  } : {
    _id: objID,
    $or: [{
      ownerId: req.user.sub
    }, {
      readIds: req.user.sub
    }, {
      src: {
        $in: userContentPerms
      }
    }]
  };
};

exports.defaultSafeReadQuery = defaultSafeReadQuery;

const defaultSafeWriteQuery = (req, objID = null, adminOverride = true) => {
  const userContentPerms = (0, _getPermissions.getWritePermissions)(req.user.permissions);
  return req.user.permissions.includes('admin') && adminOverride ? {
    _id: objID
  } : {
    _id: objID,
    $or: [{
      ownerId: req.user.sub
    }, {
      writeIds: req.user.sub
    }, {
      src: {
        $in: userContentPerms
      }
    }]
  };
};

exports.defaultSafeWriteQuery = defaultSafeWriteQuery;