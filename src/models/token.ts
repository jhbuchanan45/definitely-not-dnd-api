import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const keyStats = new Schema({
    END: Number,
    STR: Number,
    CHA: Number,
    FNS: Number,
    KNW: Number,
    WIS: Number,
    INT: Number,
})

const altStats = new Schema({
    dge: Number,
    bHP: Number,
    arm: Number,
})

const resistStats = new Schema({
    phy: Number,
    rng: Number,
    mag: Number,
})

const Token = new Schema({
    ownerId: String,
    image: String,
    name: String,
    race: String,
    stats: {
        level: Number,
        key: {
            base: keyStats,
            modifier: keyStats,
        },
        alt: altStats,
        resist: resistStats,
    },
    status: {
        cHP: Number,
        mHP: Number,
        mStm: Number,
        cStm: Number
    },
    effects: {
        burning: Boolean,
        bleeding: Boolean,
    },
    pos: {x: Number, y: Number},
    size: Number,
}, { typePojoToMixed: false, collection: "tokens" });

export default mongoose.model('Token', Token);