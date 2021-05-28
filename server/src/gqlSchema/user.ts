import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { composeOpts } from './campaign';

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    ownerId: { type: String, index: true, required: true },
    readIds: [{ type: String, default: [] }],

    lastCampaign: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
    },
  },
  { typePojoToMixed: false }
);

export const User = mongoose.model('UserGraph', UserSchema);
export const UserTC = composeMongoose(User, composeOpts);
