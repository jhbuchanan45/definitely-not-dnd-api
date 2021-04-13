import mongoose from 'mongoose';
import { Map } from '@jhbuchanan45/dnd-models';
import Campaign from './campaign';

const filePermissionsMiddleware = {
  save: async function (this: any) {
    const campaign: any = await Campaign.findOne(
      { _id: this.campaignId, writeIds: this.ownerId },
      'readIds writeIds players lastMap'
    );

    if (!campaign) {
      throw new Error(
        'Insufficient permissions to add to campaign or campaign does not exist'
      );
    }

    // if new copy read/write permissions from campaign
    if (this.isNew) {
      this.readIds = campaign.readIds;
      this.writeIds = campaign.writeIds;
    }

    if (campaign.lastMap?._id !== this._id) {
      campaign.lastMap = this._id;
    }

    await campaign.save();
  }
};

Map.pre('save', filePermissionsMiddleware.save);

export default mongoose.model('Map', Map);
