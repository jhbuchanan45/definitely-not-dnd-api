"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dndModels = require("@jhbuchanan45/dnd-models");

const Item = _mongoose.default.model('Item', _dndModels.officialItem);

(0, _dndModels.addItemTypes)(Item);
var _default = Item;
exports.default = _default;