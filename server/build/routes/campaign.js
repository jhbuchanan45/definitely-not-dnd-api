"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _campaign = _interopRequireDefault(require("../controllers/campaign"));

const campaignRoutes = _express.default.Router();

campaignRoutes.get('/', _campaign.default.get);
campaignRoutes.post('/', _campaign.default.create);
campaignRoutes.put('/:campaignID', _campaign.default.update);
campaignRoutes.delete('/:campaignID', _campaign.default.delete);
campaignRoutes.get('/:campaignID', _campaign.default.getById);

if (process.env.NODE_ENV === "development") {
  campaignRoutes.delete('/', _campaign.default.deleteAll);
}

var _default = campaignRoutes;
exports.default = _default;