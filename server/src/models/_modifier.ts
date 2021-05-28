// not actually a model, so prefixed with '_'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const coreStats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'XTR'];

const modifierOptions = {
  discriminatorKey: 'target',
  _id: false,
};

export const genericModifier = new Schema({ multiclass: { type: Boolean } }, modifierOptions);

const integerT1 = {
  mode: { type: String, required: true, enum: ['set', 'add'] },
  value: { type: Number, required: true },
  _id: false,
};

const integerT2 = {
  ...integerT1,
  t2: { type: String, required: true },
};

const stringT1 = {
  value: { type: String, required: true },
  _id: false,
};

const stringT2 = {
  ...stringT1,
  t2: { type: String, required: true },
};

const choice = new Schema({}, { discriminatorKey: 'target' }); // placeholder for actual choice schema

const choices = new Schema({
  choices: [choice],
});

export const targets = {
  core: { schema: new Schema(integerT2) },
  initiative: {
    schema: new Schema({
      ...integerT2,
      mode: { type: String, required: true, enum: ['set', 'add', 'advantage'] },
    }),
  },
  proficiency: { schema: new Schema(integerT1) },
  resist: { schema: new Schema(stringT2) },

  // coreMod uses coreMod for stat to add to AC, value is optional cap
  AC: {
    schema: new Schema({
      ...integerT1,
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
      ...integerT2,
      mode: {
        type: String,
        required: true,
        enum: ['set', 'add', 'prof', 'advantage'],
      },
    }),
  },
  savingThrows: {
    schema: new Schema({
      ...integerT2,
      mode: {
        type: String,
        required: true,
        enum: ['set', 'add', 'prof', 'advantage'],
      },
    }),
  },
  proficiencies: { schema: new Schema(stringT2) },
  HP: {
    schema: new Schema({
      ...integerT2,
      value: { type: Schema.Types.Mixed, required: true },
      // mode: { type: String, required: true, enum: ["set", "add", "hit"] }
    }),
  },
  speed: { schema: new Schema(integerT2) },
  vision: { schema: new Schema(integerT2) },
  choice: { schema: choices },
};

// discriminator from target schema
// includes choices path for giving options
// choices have id, optionally t1 + t2 + mode if required by parent

// when parsing in UI, grab from choice, then parent options
// each choice should inherit discriminator from parent *or* have a target

// assign choices to choice schema
const choicesArray: any = choices.path('choices');
for (let target in targets) {
  if (target === 'choice') {
    continue; // Leave out choice from acceptable sub-modifiers since nested choice mods not possible
  }

  choicesArray.discriminator(target, targets[target].schema, { _id: true });
  // TODO - Add support for non-generic modes (excl choice)
}

// will add discriminators to an [modifier] schema type
export const addModifierTypes = (modArray: any) => {
  // add derived types for each target
  for (let target in targets) {
    modArray.discriminator(target, targets[target].schema);
  }
};
