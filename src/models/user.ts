import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let User = new Schema({
    ownerId: { type: String, required: true, unique: true },
    lastCampaign: {type: String, required: true, default: "0"}
});

export default mongoose.model('User', User);