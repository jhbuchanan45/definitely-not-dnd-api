import mongoose from 'mongoose';
import Token, { Player } from './token';
import Map from './map';
import { composeMongoose, ComposeMongooseOpts } from 'graphql-compose-mongoose';

export const composeOpts: ComposeMongooseOpts = {
  includeBaseDiscriminators: true,
  includeNestedDiscriminators: true,
};

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

const updatePermissions = {
  save: async function (this: any) {
    if (this.isModified('writeIds readIds')) {
      await Token.updateMany(
        { campaignId: this._id },
        { readIds: this.readIds, writeIds: this.writeIds }
      );

      await Player.updateMany(
        { campaignId: this._id },
        { readIds: this.readIds, writeIds: this.writeIds }
      );

      await Map.updateMany(
        { campaignId: this._id },
        { readIds: this.readIds, writeIds: this.writeIds }
      );
    }
    console.log(this);
  },
  remove: async function (this: any) {
    // remove all child tokens
    await Token.find({ campaignId: this._id }).then((tokens) => {
      tokens.forEach(async (token) => {
        token.remove();
      });
    });

    await Player.find({ campaignId: this._id }).then((tokens) => {
      tokens.forEach(async (token) => {
        token.remove();
      });
    });

    await Map.find({ campaignId: this._id }).then((maps) => {
      maps.forEach(async (map) => {
        map.remove();
      });
    });
  },
};

CampaignSchema.pre('save', updatePermissions.save);

CampaignSchema.pre('remove', updatePermissions.remove);

const Campaign = mongoose.model('Campaign', CampaignSchema);
export default Campaign;
export const CampaignTC = composeMongoose(Campaign, composeOpts);

/* SPECIAL CASES

When updating maps, check if the name or image is being updated,
then if campaign it belongs to has it as the last map,and if so
update that as well.

Also when fetching populate players

*/
