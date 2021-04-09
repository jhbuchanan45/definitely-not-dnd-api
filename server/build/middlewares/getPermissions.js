"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWritePermissions = exports.getReadPermissions = void 0;

const getParams = perm => {
  return perm.split(':');
};

const getReadPermissions = permissions => {
  let canRead = [];
  permissions.forEach(perm => {
    const params = getParams(perm);

    if (params[0] === 'read') {
      canRead.push(params[1]);
    }
  });
  return canRead;
};

exports.getReadPermissions = getReadPermissions;

const getWritePermissions = permissions => {
  let canWrite = [];
  permissions.forEach(perm => {
    const params = getParams(perm);

    if (params[0] === 'write') {
      canWrite.push(params[1]);
    }
  });
  return canWrite;
};

exports.getWritePermissions = getWritePermissions;