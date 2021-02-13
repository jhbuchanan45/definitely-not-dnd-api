import mongoose from 'mongoose';
import Campaign from './campaign';

// const tile = {
//     moveable: { type: Boolean, default: true },
//     bgOpacity: { type: Number, default: 0.5 },
//     bgColour: { type: 'mixed', default: [255, 255, 255] },
//     bdColour: { type: String, default: "#000000" },
//     size: { type: Number, default: 25 },
// }

// const tiles = [tile];

const Schema = mongoose.Schema;
let Map = new Schema({
    ownerId: { type: String, required: true },
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    campaignId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, default: "New Map"},
    image: { type: String, default: "test.png"},
    tokens: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    sqSize: { type: Number, default: 25 },
    selectedToken: { type: String, default: "0" },
    scale: { type: Number, default: 0 },
    pos: { x: Number, y: Number, default: { x: 0, y: 0 } },
    sidebarExpanded: { type: Boolean, default: true }
},
    { typePojoToMixed: false});

const filePermissionsMiddleware = {
        save: async function (this: any) {
            const campaign: any = await Campaign.findOne({ _id: this.campaignId, writeIds: this.ownerId }, 'readIds writeIds players lastMap');
    
            if (!campaign) {
                throw new Error("Insufficient permissions to add to campaign or campaign does not exist")
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
}

Map.pre('save', filePermissionsMiddleware.save)

export default mongoose.model('Map', Map);