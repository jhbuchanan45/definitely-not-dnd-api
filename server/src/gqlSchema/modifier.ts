import { coreStats } from './token';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const modifierOptions = {
  discriminatorKey: 'target',
  _id: false,
};

export const genericModifier = new Schema({ multiclass: { type: Boolean } }, modifierOptions);

const intT1 = {
  mode: { type: String, required: true, enum: ['set', 'add'] },
  value: { type: Number, required: true },
  _id: false,
};

const intT2 = {
  ...intT1,
  t2: { type: String, required: true },
};

const strT1 = {
  value: { type: String, required: true },
  _id: false,
};

const strT2 = {
  ...strT1,
  t2: { type: String, required: true },
};

const choiceSchema = new Schema({}, { discriminatorKey: 'target' }); // placeholder for actual choice schema

const choicesSchema = new Schema({
  choices: [choiceSchema],
});

export const targets = {
  core: { schema: new Schema(intT2) },
  initiative: {
    schema: new Schema({
      ...intT2,
      mode: { type: String, required: true, enum: ['set', 'add', 'advantage'] },
    }),
  },
  proficiency: { schema: new Schema(intT1) },
  resist: { schema: new Schema(strT2) },

  // coreMod uses coreMod for stat to add to AC, value is optional cap
  AC: {
    schema: new Schema({
      ...intT1,
      mode: {
        type: String,
        required: true,
        num: ['set', 'add', 'base', 'coreMod'],
      },
      coreMod: { type: String, enum: coreStats },
    }),
  },
  skills: {
    schema: new Schema({
      ...intT2,
      mode: {
        type: String,
        required: true,
        enum: ['set', 'add', 'prof', 'advantage'],
      },
    }),
  },
  savingThrows: {
    schema: new Schema({
      ...intT2,
      mode: {
        type: String,
        required: true,
        enum: ['set', 'add', 'prof', 'advantage'],
      },
    }),
  },
  proficiencies: { schema: new Schema(strT2) },
  HP: {
    schema: new Schema({
      ...intT2,
      value: { type: Schema.Types.Mixed, required: true },
      // mode: { type: String, required: true, enum: ["set", "add", "hit"] }
    }),
  },
  speed: { schema: new Schema(intT2) },
  vision: { schema: new Schema(intT2) },
  choice: { schema: choicesSchema },
};

// discrimator from target schema
// includes choices path for giving options
// choices have id, optionally t1 + t2 + mode if required by parent

// when parsing in UI, grab from choice, then parent options
// each choice should inherit discriminator from parent *or* have a target

// assign choices to choice schema
const choicesArray: any = choicesSchema.path('choices');
for (let target in targets) {
  if (target === 'choice') {
    continue; // Leave out choice from acceptable sub-modifiers
  }

  choicesArray.discriminator(target, targets[target].schema, { _id: true });
  // TODO - Add support for non-generic modes (excl choice)
}

// will add discriminators to an array of modifiers
export const addModifierTypes = (modArray: any) => {
  // add derived types for each target
  for (let target in targets) {
    modArray.discriminator(target, targets[target].schema);
  }
};