"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dndModels = require("@jhbuchanan45/dnd-models");

var _token = _interopRequireWildcard(require("./token"));

var _map = _interopRequireDefault(require("./map"));

const updatePermissions = {
  save: async function () {
    if (this.isModified('writeIds readIds')) {
      await _token.default.updateMany({
        campaignId: this._id
      }, {
        readIds: this.readIds,
        writeIds: this.writeIds
      });
      await _token.Player.updateMany({
        campaignId: this._id
      }, {
        readIds: this.readIds,
        writeIds: this.writeIds
      });
      await _map.default.updateMany({
        campaignId: this._id
      }, {
        readIds: this.readIds,
        writeIds: this.writeIds
      });
    }

    console.log(this);
  },
  remove: async function () {
    // remove all child tokens
    await _token.default.find({
      campaignId: this._id
    }).then(tokens => {
      tokens.forEach(async token => {
        token.remove();
      });
    });
    await _token.Player.find({
      campaignId: this._id
    }).then(tokens => {
      tokens.forEach(async token => {
        token.remove();
      });
    });
    await _map.default.find({
      campaignId: this._id
    }).then(maps => {
      maps.forEach(async map => {
        map.remove();
      });
    });
  }
};

_dndModels.Campaign.pre('save', updatePermissions.save);

_dndModels.Campaign.pre('remove', updatePermissions.remove);

var _default = _mongoose.default.model('Campaign', _dndModels.Campaign);
/* SPECIAL CASES

When updating maps, check if the name or image is being updated,
then if campaign it belongs to has it as the last map,and if so
update that as well.

Also when fetching populate players

*/


exports.default = _default;