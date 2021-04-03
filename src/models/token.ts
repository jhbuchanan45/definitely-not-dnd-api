import mongoose from 'mongoose';
import { Token } from '@jhbuchanan45/dnd-models';
import Campaign from './campaign';

const addPlayerMiddleware = {
    save: async function (this: any) {
        const campaign: any = await Campaign.findOne({ _id: this.campaignId, writeIds: this.ownerId }, 'readIds writeIds players');

        if (!campaign) {
            throw new Error("Insufficient permissions to add to campaign or campaign does not exist")
        }

        // if player is changed, add it to read permissions for campaign unless blank
        if (this.isModified('player') && this.player !== "") {
            if (campaign.readIds.indexOf(this.player) === -1) { campaign.readIds.push(this.player) };
        }
        // if new copy read/write permissions from campaign
        if (this.isNew) {

            this.readIds = campaign.readIds;
            this.writeIds = campaign.writeIds;

            // if player model then also update the campaign playerID array
            if (this.constructor.modelName === "Player") {
                campaign.players.push(this._id);
            }
        }

        await campaign.save();
    },

    remove: async function (this: any) {
        const campaign: any = await Campaign.findOne({ _id: this.campaignId, writeIds: this.ownerId }, 'readIds writeIds players');

        // remove player from campaign if applicable
        if (this.modelName === "Player") {
            const index = campaign.players.indexOf(this._id)
            if (index > -1) {
                campaign.players.splice(index, 1);
            }
        }
    }
}

Token.pre('save', addPlayerMiddleware.save);

Token.pre('remove', addPlayerMiddleware.remove);

export default mongoose.model('Token', Token);

export const Player = mongoose.model('Player', Token);