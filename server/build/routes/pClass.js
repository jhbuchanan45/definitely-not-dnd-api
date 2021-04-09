"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _pClass = _interopRequireDefault(require("../controllers/pClass"));

const classRoutes = _express.default.Router();

classRoutes.get('/', _pClass.default.get);
classRoutes.post('/', _pClass.default.create);
classRoutes.put('/:pClassID', _pClass.default.update);
classRoutes.delete('/:pClassID', _pClass.default.delete);
classRoutes.get('/:pClassID', _pClass.default.getById);

if (process.env.NODE_ENV === "development") {
  classRoutes.delete('/', _pClass.default.deleteAll);
}

var _default = classRoutes;
exports.default = _default;