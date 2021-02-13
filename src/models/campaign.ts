import mongoose from 'mongoose';
import Token, { Player } from './token';
import Map from './map';

const Schema = mongoose.Schema;
let Campaign = new Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true, default: "" },
    image: { type: String, required: true, default: "" },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    lastMap: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' }
});

const updatePermissions = {
    save: async function (this: any) {
        if (this.isModified('writeIds readIds')) {
            await Token.updateMany({ campaignId: this._id }, { readIds: this.readIds, writeIds: this.writeIds });

            await Player.updateMany({ campaignId: this._id }, { readIds: this.readIds, writeIds: this.writeIds });

            await Map.updateMany({ campaignId: this._id }, { readIds: this.readIds, writeIds: this.writeIds });
        }
    },
    remove: async function (this: any) {
        // remove all child tokens
        await Token.find({ campaignId: this._id })
        .then((tokens) => {
            tokens.forEach(async (token) => {token.remove()})
        });

        await Player.find({ campaignId: this._id })
        .then((tokens) => {
            tokens.forEach(async (token) => {token.remove()})
        });

        await Map.find({ campaignId: this._id })
        .then((maps) => {
            maps.forEach(async (map) => {map.remove()})
        });
    }
}

Campaign.pre('save', updatePermissions.save);

Campaign.pre('remove', updatePermissions.remove);

export default mongoose.model('Campaign', Campaign);

/* SPECIAL CASES

When updating maps, check if the name or image is being updated,
then if campaign it belongs to has it as the last map,and if so
update that as well.

Also when fetching populate players

*/