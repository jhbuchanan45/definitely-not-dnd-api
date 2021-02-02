import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let Campaign = new Schema({
    ownerId: { type: String, required: true },
    maps: [{ type: String, required: true, default: [""] }],
    tokens: [{ type: String, required: true, default: [""] }],
    name: { type: String, required: true, default: "" },
    image: { type: String, required: true, default: "" },
    players: [{ type: String, required: true, default: [""] }],
    lastMap: {type: String, required: true, default: "0"}
});

export default mongoose.model('Campaign', Campaign);