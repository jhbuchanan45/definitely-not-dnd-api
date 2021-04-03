import mongoose from 'mongoose';
import { genericModifier, addModifierTypes, targets as modTargets } from './pClass';
const Schema = mongoose.Schema;


const baseACSchema = new Schema({
    ...modTargets.AC.schema.obj,
    mode: { type: String, required: true, enum: ["base"], default: "base" },
    target: { type: String, required: true, enum: ["AC"], default: "AC" }
});

const acModSchema = new Schema({
    ...modTargets.AC.schema.obj,
    mode: { type: String, required: true, enum: ["coreMod"], default: "coreMod" },
    target: { type: String, required: true, enum: ["AC"], default: "AC" }
});

export const itemTypes = {
    'armour': {
        schema: new Schema({
            armourType: { type: String, enum: ['light', 'medium', 'heavy', 'shield'], required: true },
            baseAC: { type: baseACSchema, required: true },
            coreMod: { type: acModSchema, required: false },
            mods: { type: [genericModifier] }
        })
    }
}

// add discriminators to AC mod slot
addModifierTypes(itemTypes.armour.schema.path('mods'));

const commonItem = {
    index: { type: String, unique: true, index: true, required: true },
    ownerId: { type: String, index: true, required: true },
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    name: { type: String, required: true, default: "New Item" },

    weight: { type: Number, min: 0, required: true },
    cost: { type: Number, min: 0, required: true },
    equippable: { type: Boolean, default: false, required: true },
    // only changeable by admin through special endpoints; e.g. "5e-srd","exp-1", etc. 
    // standard controller will set this to "homebrew"
    src: { type: String, required: true, default: "homebrew" }
}

const itemOptions = {
    discriminatorKey: "itemType"
}

// main types = armour | weapon | gear | magic?
// this type will be used for the 'official' collection
const officialItem = new Schema({
    ...commonItem,

}, itemOptions);

// add discriminators to model
export const addItemTypes = (model, includeChoice = true) => {
    for (let itemType in itemTypes) {
        if (!includeChoice && itemType === 'choice') { continue; }
        model.discriminator(itemType, itemTypes[itemType].schema)
    }
}

// set partial index on all official content
officialItem.index({ src: 1 }, {
    partialFilterExpression: {
        'src': { $exists: true, $gt: 'homebrew' }
    }
})

export { officialItem };