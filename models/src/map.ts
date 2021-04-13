import mongoose from 'mongoose';

// const tile = {
//     moveable: { type: Boolean, default: true },
//     bgOpacity: { type: Number, default: 0.5 },
//     bgColour: { type: 'mixed', default: [255, 255, 255] },
//     bdColour: { type: String, default: "#000000" },
//     size: { type: Number, default: 25 },
// }

// const tiles = [tile];

const Schema = mongoose.Schema;
const Map = new Schema(
  {
    ownerId: { type: String, required: true },
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, default: 'New Map' },
    image: { type: String, default: 'test.png' },
    tokens: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    sqSize: { type: Number, default: 25 },
    selectedToken: { type: String, default: '0' },
    scale: { type: Number, default: 0 },
    pos: { x: Number, y: Number, default: { x: 0, y: 0 } },
    sidebarExpanded: { type: Boolean, default: true },
  },
  { typePojoToMixed: false }
);

export { Map };
