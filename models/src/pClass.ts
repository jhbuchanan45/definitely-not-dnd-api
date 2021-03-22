import mongoose from 'mongoose';
// import { Token } from './token';
const Schema = mongoose.Schema;

// const { readIds, writeIds, pos, size, ...tokenPathsObj } = Token.paths;

// let tokenPaths = [];
// let path: any;
// for (path in tokenPathsObj) {
//     tokenPaths.push(path.path);
// }

const targets = [
    "core",
    "initiative",
    "proficiency",
    "resist",
    "AC",
    "skills",
    "savingThrows",
    "proficiencies",
    "HP",
    "speed",
    "vision"
]

const modifier = {
    target: { type: String, required: true, enum: targets },
    t2: { type: String },
    t3: { type: String },
    mode: { type: String, enum: ["set","add", "prof"] },
    value: { type: Schema.Types.Mixed },
    description: { type: String }
}

const pClass = new Schema({
    ownerId: { type: String, required: true },
    label: { type: String, required: true, default: "" },
    modifiers: [modifier],
    readIds: [{ type: String, default: [] }],
    writeIds: [{ type: String, default: [] }],
    public: { type: Boolean }
}, { typePojoToMixed: false });

export { pClass };