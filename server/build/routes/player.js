"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _token = require("../controllers/token");

var _token2 = require("../models/token");

const tokenController = (0, _token.generateTokenTypes)(_token2.Player);

const playerRoutes = _express.default.Router();

playerRoutes.get('/campaign/:campaignId', tokenController.get);
playerRoutes.post('/', tokenController.create);
playerRoutes.put('/:tokenID', tokenController.update);
playerRoutes.delete('/:tokenID', tokenController.delete);
playerRoutes.get('/:tokenID', tokenController.getById);

if (process.env.NODE_ENV === "development") {
  playerRoutes.delete('/', tokenController.deleteAll);
}

var _default = playerRoutes;
exports.default = _default;