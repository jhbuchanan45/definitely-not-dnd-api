import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const keyStats = {
    END: {type: Number, default: 0},
    STR: {type: Number, default: 0},
    CHA: {type: Number, default: 0},
    FNS: {type: Number, default: 0},
    KNW: {type: Number, default: 0},
    WIS: {type: Number, default: 0},
    INT: {type: Number, default: 0},
}

const altStats = {
    dge: {type: Number, default: 0},
    bHP: {type: Number, default: 0},
    arm: {type: Number, default: 0},
}

const resistStats = {
    phy: {type: Number, default: 0},
    rng: {type: Number, default: 0},
    mag: {type: Number, default: 0},
}

const Token = new Schema({
    ownerId: {type: String, required: true},
    image: {type: String, required: true, default: ""},
    name: {type: String, required: true, default: "None"},
    race: {type: String, required: true, default: "None"},
    player: {type: String, required: true, default: ""},
    stats: {
        level: {type: Number, default: 0},
        key: {
            base: keyStats,
            modifier: keyStats,
        },
        alt: altStats,
        resist: resistStats,
    },
    status: {
        cHP: {type: Number, default: 0},
        mHP: {type: Number, default: 0},
        mStm: {type: Number, default: 0},
        cStm: {type: Number, default: 0}
    },
    effects: {
        burning: {type: Boolean, default: false},
        bleeding: {type: Boolean, default: false},
    },
    pos: {x: {type: Number, default: 0}, y: {type: Number, default: 0}},
    size: {type: Number, default: 0},
}, { typePojoToMixed: false, collection: "tokens" });

export default mongoose.model('Token', Token);