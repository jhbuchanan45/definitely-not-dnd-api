import mongoose, { Schema } from 'mongoose';

const coreStats = ["STR", "DEX", "CON", "INT", "WIS", "CHA", "XTR"];

const keyStats = {
    STR: { type: Number, default: 0 },
    DEX: { type: Number, default: 0 },
    CON: { type: Number, default: 0 },
    INT: { type: Number, default: 0 },
    WIS: { type: Number, default: 0 },
    CHA: { type: Number, default: 0 },
    XTR: { type: Number, default: 0 },
}

const proficiencies = {
    armour: [{ type: String, default: [] }],
    weapons: [{ type: String, default: [] }],
    tools: [{ type: String, default: [] }],
    languages: [{ type: String, default: [] }]
}

const HP = {
    current: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    tmp: { type: Number, default: 0 },
    hit: { type: String, default: "" }
}

const savingThrow = {
    prof: { type: Boolean, default: false },
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

const speed = {
    walking: { type: Number, default: 30 },
    swimming: { type: Number, default: 15 },
    climbing: { type: Number, default: 15 },
    flying: { type: Number, default: 0 }
}

const skillCheck = (defaultStat: String = "STR") => {
    return {
        prof: { type: Boolean, default: false },
        mod: { type: Number, default: 0 },
        bns: { type: Number, default: 0 },
        check: { type: String, enum: coreStats, default: defaultStat }
    }
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
    stats: {
        level: { type: Number, default: 0 },
        initative: { type: Number, default: 0 },
        proficiency: { type: Number, default: 0 },
        inspiration: { type: Boolean, default: false },
        deathSaving,
        resist: [{ type: String, default: [] }],
        AC: { type: Number, default: 0 },
        key: {
            base: keyStats,
            modifier: keyStats,
        },
        skills,
        savingThrows,
        proficiencies,
        HP,
        speed
    },
    pos: { x: { type: Number, default: 0 }, y: { type: Number, default: 0 } },
    size: { type: Number, default: 0 },
}, { typePojoToMixed: false });

export { Token }