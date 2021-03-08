import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Campaign = new Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true, default: "" },
    image: { type: String, required: true, default: "" },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    lastMap: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' }
});

export { Campaign };

/* SPECIAL CASES

When updating maps, check if the name or image is being updated,
then if campaign it belongs to has it as the last map,and if so
update that as well.

Also when fetching populate players

*/