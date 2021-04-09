"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dndModels = require("@jhbuchanan45/dnd-models");

var _campaign = _interopRequireDefault(require("./campaign"));

const filePermissionsMiddleware = {
  save: async function () {
    var _campaign$lastMap;

    const campaign = await _campaign.default.findOne({
      _id: this.campaignId,
      writeIds: this.ownerId
    }, 'readIds writeIds players lastMap');

    if (!campaign) {
      throw new Error("Insufficient permissions to add to campaign or campaign does not exist");
    } // if new copy read/write permissions from campaign


    if (this.isNew) {
      this.readIds = campaign.readIds;
      this.writeIds = campaign.writeIds;
    }

    if (((_campaign$lastMap = campaign.lastMap) === null || _campaign$lastMap === void 0 ? void 0 : _campaign$lastMap._id) !== this._id) {
      campaign.lastMap = this._id;
    }

    await campaign.save();
  }
};

_dndModels.Map.pre('save', filePermissionsMiddleware.save);

var _default = _mongoose.default.model('Map', _dndModels.Map);

exports.default = _default;