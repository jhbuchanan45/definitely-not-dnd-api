"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = _interopRequireDefault(require("../controllers/user"));

const userRoutes = _express.default.Router();

userRoutes.get('/', _user.default.get); // userRoutes.post('/', userController.create);

userRoutes.put('/', _user.default.update);
userRoutes.delete('/', _user.default.delete);
userRoutes.get('/:userID', _user.default.getById);

if (process.env.NODE_ENV === "development") {
  userRoutes.delete('/', _user.default.deleteAll);
}

var _default = userRoutes;
exports.default = _default;