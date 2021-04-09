"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _map = _interopRequireDefault(require("../controllers/map"));

const mapRoutes = _express.default.Router();

mapRoutes.get('/campaign/:campaignId', _map.default.get);
mapRoutes.post('/', _map.default.create);
mapRoutes.put('/:mapID', _map.default.update);
mapRoutes.delete('/:mapID', _map.default.delete);
mapRoutes.get('/:mapID', _map.default.getById);

if (process.env.NODE_ENV === "development") {
  mapRoutes.delete('/', _map.default.deleteAll);
}

var _default = mapRoutes;
exports.default = _default;