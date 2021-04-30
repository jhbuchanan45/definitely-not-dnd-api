import { coreStats } from './token';
import mongoose from 'mongoose';
import { genericModifier, addModifierTypes } from './modifier';
import { composeMongoose } from 'graphql-compose-mongoose';
const Schema = mongoose.Schema;

const feature = new Schema({
  _id: false,
  name: { type: String, required: true },
  description: { type: String },
  multiclass: { type: Boolean },
  level: { type: Number, required: true, min: 0, max: 40 },
  modifiers: [genericModifier],
});

const modArray: any = feature.path('modifiers');
addModifierTypes(modArray);

const pClass = new Schema(
  {
    ownerId: { type: String, required: true },
    label: { type: String, required: true, default: '' },
    multiclassReq: [
      {
        core: { type: String, enum: coreStats, required: true },
        val: { type: Number, min: 0, max: 30 },
      },
    ],
    features: [feature],
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    public: { type: Boolean },
  },
  { typePojoToMixed: false }
);

export const PClass = mongoose.model('ClassGraph', pClass);
export const ClassTC = composeMongoose(PClass);
