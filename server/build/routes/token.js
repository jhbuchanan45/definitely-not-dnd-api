"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _token = require("../controllers/token");

var _token2 = _interopRequireDefault(require("../models/token"));

const tokenController = (0, _token.generateTokenTypes)(_token2.default);

const tokenRoutes = _express.default.Router();

tokenRoutes.get('/campaign/:campaignId', tokenController.get);
tokenRoutes.post('/', tokenController.create);
tokenRoutes.put('/:tokenID', tokenController.update);
tokenRoutes.delete('/:tokenID', tokenController.delete);
tokenRoutes.get('/:tokenID', tokenController.getById);

if (process.env.NODE_ENV === "development") {
  tokenRoutes.delete('/', tokenController.deleteAll);
}

var _default = tokenRoutes;
exports.default = _default;