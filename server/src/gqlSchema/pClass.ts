import { coreStats } from './token';
import mongoose from 'mongoose';
import { genericModifier, addModifierTypes } from './modifier';
import { composeMongoose, EDiscriminatorTypeComposer } from 'graphql-compose-mongoose';
import { composeOpts } from './campaign';
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

pClass.set('discriminatorKey', 'testKey');

const classSecondSchema = new Schema(
  {
    extraField: String,
    extra2Field: { type: 'String', required: true, enum: 'Test Enum' },
  },
  { typePojoToMixed: false }
);

export const PClass = mongoose.model('ClassGraph', pClass);
const ExtraClass = PClass.discriminator('extraToken', classSecondSchema);
export const ClassTC = composeMongoose(PClass, composeOpts);

console.log((ClassTC as EDiscriminatorTypeComposer<any, any>).getDiscriminatorTCs());
const ExtraClassTC = (ClassTC as EDiscriminatorTypeComposer<any, any>).getDiscriminatorTCs()
  ?.extraToken;
export { ExtraClassTC };
