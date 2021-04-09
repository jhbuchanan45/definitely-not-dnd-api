"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _item = _interopRequireDefault(require("../controllers/item"));

const itemRoutes = _express.default.Router();

itemRoutes.get('/', _item.default.get);
itemRoutes.post('/', _item.default.create);
itemRoutes.put('/:itemID', _item.default.update);
itemRoutes.delete('/:itemID', _item.default.delete);
itemRoutes.get('/:itemID', _item.default.getById);

if (process.env.NODE_ENV === "development") {
  itemRoutes.delete('/', _item.default.deleteAll);
}

var _default = itemRoutes;
exports.default = _default;