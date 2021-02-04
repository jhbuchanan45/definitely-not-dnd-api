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
    playerId: [{ type: String }],
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
    save: async function (this: any, next: any) {
        let campaign: any;

        if (this.isModified('player') && this.player !== "") {

            campaign = await Campaign.findOneAndUpdate({ _id: this.campaignId, ownerId: this.ownerId }, { $addToSet: { playerId: this.player } }, { projection: 'playerId' });
            if (!campaign) {
                throw new Error("Insufficient permissions to add to campaign or campaign does not exist")
            }

        }
        if (this.isNew) {
            if (campaign === undefined) {
                campaign = await Campaign.findById({ _id: this.campaignId, ownerId: this.ownerId }, 'playerId')
                if (!campaign) {
                    throw new Error("Insufficient permissions to add to campaign or campaign does not exist")
                }
            }
            this.playerId = campaign.playerId;
        }
        next();
    },
    updateOne: async function (this: any) {
        if (this.isModified('player') && this.player !== "") {

            await Campaign.updateOne({ _id: this.campaignId, ownerId: this.ownerId }, { $addToSet: { playerId: this.player } })
        }
    }
}

Token.pre('save', addPlayerMiddleware.save)

Token.pre('updateOne', addPlayerMiddleware.updateOne)

export default mongoose.model('Token', Token);

export const Player = mongoose.model('Player', Token)