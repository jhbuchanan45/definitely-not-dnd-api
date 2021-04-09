"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dndModels = require("@jhbuchanan45/dnd-models");

var _default = _mongoose.default.model('pClass', _dndModels.pClass);

exports.default = _default;