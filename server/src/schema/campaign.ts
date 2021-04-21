import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

const Schema = mongoose.Schema;
const CampaignSchema = new Schema(
  {
    ownerId: { type: String, index: true, required: true },
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    template: { type: Boolean, default: false },
    src: { type: String, default: 'homebrew' },

    name: { type: String, required: true, default: '' },
    image: { type: String, required: true, default: '' },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    lastMap: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' },
  },
  { typePojoToMixed: false }
);

export const Campaign = mongoose.model('CampaignGraph', CampaignSchema);
export const CampaignTC = composeMongoose(Campaign);
