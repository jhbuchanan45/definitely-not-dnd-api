import mongoose, { Schema } from 'mongoose';
import Campaign from './campaign';

const keyStats = {
    END: { type: Number, default: 0 },
    STR: { type: Number, default: 0 },
    CHA: { type: Number, default: 0 },
    FNS: { type: Number, default: 0 },
    KNW: { type: Number, default: 0 },
    WIS: { type: Number, default: 0 },
    INT: { type: Number, default: 0 },
}

const altStats = {
    dge: { type: Number, default: 0 },
    bHP: { type: Number, default: 0 },
    arm: { type: Number, default: 0 },
}

const resistStats = {
    phy: { type: Number, default: 0 },
    rng: { type: Number, default: 0 },
    mag: { type: Number, default: 0 },
}

const Token = new Schema({
    ownerId: { type: String, required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, required: true },
    image: { type: String, required: true, default: "" },
    name: { type: String, required: true, default: "None" },
    race: { type: String, required: true, default: "None" },
    player: { type: String, default: "" },
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    stats: {
        level: { type: Number, default: 0 },
        key: {
            base: keyStats,
            modifier: keyStats,
        },
        alt: altStats,
        resist: resistStats,
    },
    status: {
        cHP: { type: Number, default: 0 },
        mHP: { type: Number, default: 0 },
        mStm: { type: Number, default: 0 },
        cStm: { type: Number, default: 0 }
    },
    effects: {
        burning: { type: Boolean, default: false },
        bleeding: { type: Boolean, default: false },
    },
    pos: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
    size: { type: Number, default: 0 },
}, { typePojoToMixed: false });

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

    remove: async function (this:any) {
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