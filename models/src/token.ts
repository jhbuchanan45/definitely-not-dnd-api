import mongoose, { Schema } from 'mongoose';

const coreStats = ["STR", "DEX", "CON", "INT", "WIS", "CHA", "XTR"];

const keyStatsGen = () => {
    let keyStatsOutput = {};

    for (let stat in coreStats) {
        keyStatsOutput[coreStats[stat]] = {
            raw: { type: Number, default: 10 },
            base: { type: Number, default: 0 },
            mod: { type: Number, default: 0 }
        }
    }

    return keyStatsOutput;
}

const keyStats = keyStatsGen();

const proficiencies = {
    armour: [{ type: String, default: [] }],
    weapons: [{ type: String, default: [] }],
    tools: [{ type: String, default: [] }],
    languages: [{ type: String, default: [] }]
}

const HP = {
    current: { type: Number, default: 0 },
    max: { base: { type: Number, default: 0 } },
    tmp: { base: { type: Number, default: 0 } },
    hit: { base: { type: String, default: "" } }
}

const savingThrow = {
    prof: { flag: { type: Boolean, default: false } },
    mod: { type: Number, default: 0 },
    bns: { type: Number, default: 0 }
}

const savingThrows = {
    STR: savingThrow,
    DEX: savingThrow,
    CON: savingThrow,
    INT: savingThrow,
    WIS: savingThrow,
    CHA: savingThrow,
    XTR: savingThrow,
}

const deathSaving = {
    success: { type: Number, default: 0, min: 0, max: 3 },
    failure: { type: Number, default: 0, min: 0, max: 3 }
}

const resist = {
    vul: { base: [{ type: String, default: [] }] },
    res: { base: [{ type: String, default: [] }] }
}

const speed = {
    walking: { base: { type: Number, default: 30 } },
    swimming: { base: { type: Number, default: 15 } },
    climbing: { base: { type: Number, default: 15 } },
    flying: { base: { type: Number, default: 0 } },
    burrowing: { base: { type: Number, default: 0 } },
}

const skillCheck = (defaultStat: String = "STR") => {
    return {
        prof: { flag: { type: Boolean, default: false } },
        mod: { type: Number, default: 0 },
        bns: { type: Number, default: 0 },
        check: { type: String, enum: coreStats, default: defaultStat }
    }
}

const classFormat = {
    level: { type: Number, default: 0 },
    label: { type: String, default: "New Class" },
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'pClass' } // eventually required
}

const skills = {
    acrobatics: skillCheck("DEX"),
    animalHandling: skillCheck("WIS"),
    arcana: skillCheck("INT"),
    athletics: skillCheck("STR"),
    deception: skillCheck("CHA"),
    history: skillCheck("INT"),
    insight: skillCheck("WIS"),
    intimidation: skillCheck("CHA"),
    investigation: skillCheck("INT"),
    medicine: skillCheck("WIS"),
    nature: skillCheck("INT"),
    perception: skillCheck("WIS"),
    performance: skillCheck("CHA"),
    persuasion: skillCheck("CHA"),
    religion: skillCheck("INT"),
    sleightOfHand: skillCheck("DEX"),
    survival: skillCheck("WIS"),
    extra: [skillCheck()]
}

const vision = {
    darkvision: { base: { type: Number, default: 0 } },
    blindsight: { base: { type: Number, default: 0 } },
    tremorsense: { base: { type: Number, default: 0 } },
    truesight: { base: { type: Number, default: 0 } }
}

const Token = new Schema({
    ownerId: { type: String, required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, required: true },
    image: { type: String, required: true, default: "" },
    name: { type: String, required: true, default: "New Character" },
    race: { type: String, default: "None" },
    alignment: { type: String, default: "Neutral" },
    player: { type: String, default: "" },
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    classes: [classFormat],
    inspiration: { type: Boolean, default: false },
    deathSaving,
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
        vision
    },
    pos: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
    size: { type: Number, default: 0 },
}, { typePojoToMixed: false });

export { Token }