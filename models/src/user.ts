import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const User = new Schema({
  ownerId: { type: String, required: true, unique: true },
  lastCampaign: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null,
  },
});

export { User };
