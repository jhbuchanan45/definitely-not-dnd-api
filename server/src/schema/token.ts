import { composeMongoose } from 'graphql-compose-mongoose';
import mongoose, { Schema } from 'mongoose';

export const coreStats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'XTR'];

const keyStatsGen = () => {
  let keyStatsOutput = {};

  for (let stat in coreStats) {
    keyStatsOutput[coreStats[stat]] = {
      raw: { type: Number, default: 10 },
      base: { type: Number, default: 0 },
      mod: { type: Number, default: 0 },
    };
  }

  return keyStatsOutput;
};

const prof = {
  level: { type: Number, default: 0, min: -10, max: 10 },
};

const keyStats = keyStatsGen();

const proficiencies = {
  armour: [{ type: String, default: [] }],
  weapons: [{ type: String, default: [] }],
  tools: [{ type: String, default: [] }],
  languages: [{ type: String, default: [] }],
};

const deathSaving = {
  success: { type: Number, default: 0, min: 0, max: 3 },
  failure: { type: Number, default: 0, min: 0, max: 3 },
};

const HP = {
  current: { type: Number, default: 0 },
  max: { base: { type: Number, default: 0 } },
  tmp: { base: { type: Number, default: 0 } },
  hit: { base: { type: String, default: '' } },
  deathSaving,
};

const savingThrow = {
  prof: prof,
  mod: { type: Number, default: 0 },
  bns: { type: Number, default: 0 },
};

const savingThrows = {
  STR: savingThrow,
  DEX: savingThrow,
  CON: savingThrow,
  INT: savingThrow,
  WIS: savingThrow,
  CHA: savingThrow,
  XTR: savingThrow,
};

const resist = {
  vul: { base: [{ type: String, default: [] }] },
  res: { base: [{ type: String, default: [] }] },
};

const speed = {
  walking: { base: { type: Number, default: 30 } },
  swimming: { base: { type: Number, default: 15 } },
  climbing: { base: { type: Number, default: 15 } },
  flying: { base: { type: Number, default: 0 } },
  burrowing: { base: { type: Number, default: 0 } },
};

const skillCheck = (defaultStat: String = 'STR', label: String = 'Skill') => {
  return {
    prof: prof,
    mod: { type: Number, default: 0 },
    bns: { type: Number, default: 0 },
    label: { type: String, default: label },
    check: { type: String, enum: coreStats, default: defaultStat },
  };
};

const classFormat = {
  level: { type: Number, default: 0, required: true },
  label: { type: String, default: 'New Class' },
  data: {
    choices: { type: Map, of: String },
  },
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'pClass', required: true },
};

const skills = {
  acrobatics: skillCheck('DEX', 'Acrobatics'),
  animalHandling: skillCheck('WIS', 'Animal Handling'),
  arcana: skillCheck('INT', 'Arcana'),
  athletics: skillCheck('STR', 'Athletics'),
  deception: skillCheck('CHA', 'Deception'),
  history: skillCheck('INT', 'History'),
  insight: skillCheck('WIS', 'Insight'),
  intimidation: skillCheck('CHA', 'Intimidation'),
  investigation: skillCheck('INT', 'Investigation'),
  medicine: skillCheck('WIS', 'Medicine'),
  nature: skillCheck('INT', 'Nature'),
  perception: skillCheck('WIS', 'Perception'),
  performance: skillCheck('CHA', 'Performance'),
  persuasion: skillCheck('CHA', 'Persuasion'),
  religion: skillCheck('INT', 'Religion'),
  sleightOfHand: skillCheck('DEX', 'Sleight of Hand'),
  survival: skillCheck('WIS', 'Survival'),
  extra: [skillCheck()],
};

const vision = {
  darkvision: { base: { type: Number, default: 0 } },
  blindsight: { base: { type: Number, default: 0 } },
  tremorsense: { base: { type: Number, default: 0 } },
  truesight: { base: { type: Number, default: 0 } },
};

const inventoryItem = {
  quantity: { type: Number, required: true, default: 1 },
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  equipped: { type: Boolean, default: false },
  _id: false,
};

const token = new Schema(
  {
    ownerId: { type: String, required: true },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    image: { type: String, required: true, default: '' },
    name: { type: String, required: true, default: 'New Character' },
    race: { type: String, default: 'None' },
    alignment: { type: String, default: 'Neutral' },
    player: { type: String, default: '' },
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    classes: [classFormat],
    inventory: [inventoryItem],
    inspiration: { type: Boolean, default: false },
    stats: {
      core: keyStats,
      initiative: { base: { type: Number, default: 0 } },
      proficiency: { base: { type: Number, default: 0 } },
      resist,
      AC: { base: { type: Number, default: 0 } },
      skills,
      savingThrows,
      proficiencies,
      HP,
      speed,
      vision,
    },
    pos: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
    size: { type: Number, default: 0 },
  },
  { typePojoToMixed: false }
);

export const Token = mongoose.model('TokenGraph', token);
export const TokenTC = composeMongoose(Token);
