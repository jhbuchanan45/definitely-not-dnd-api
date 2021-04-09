"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dndModels = require("@jhbuchanan45/dnd-models");

var _campaign = _interopRequireDefault(require("./campaign"));

const addPlayerMiddleware = {
  save: async function () {
    const campaign = await _campaign.default.findOne({
      _id: this.campaignId,
      writeIds: this.ownerId
    }, 'readIds writeIds players');

    if (!campaign) {
      throw new Error("Insufficient permissions to add to campaign or campaign does not exist");
    } // if player is changed, add it to read permissions for campaign unless blank


    if (this.isModified('player') && this.player !== "") {
      if (campaign.readIds.indexOf(this.player) === -1) {
        campaign.readIds.push(this.player);
      }

      ;
    } // if new copy read/write permissions from campaign


    if (this.isNew) {
      this.readIds = campaign.readIds;
      this.writeIds = campaign.writeIds; // if player model then also update the campaign playerID array

      if (this.constructor.modelName === "Player") {
        campaign.players.push(this._id);
      }
    }

    await campaign.save();
  },
  remove: async function () {
    const campaign = await _campaign.default.findOne({
      _id: this.campaignId,
      writeIds: this.ownerId
    }, 'readIds writeIds players'); // remove player from campaign if applicable

    if (this.modelName === "Player") {
      const index = campaign.players.indexOf(this._id);

      if (index > -1) {
        campaign.players.splice(index, 1);
      }
    }
  }
};

_dndModels.Token.pre('save', addPlayerMiddleware.save);

_dndModels.Token.pre('remove', addPlayerMiddleware.remove);

var _default = _mongoose.default.model('Token', _dndModels.Token);

exports.default = _default;

const Player = _mongoose.default.model('Player', _dndModels.Token);

exports.Player = Player;