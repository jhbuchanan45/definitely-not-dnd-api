import mongoose from 'mongoose';
import Token from './token';

const Schema = mongoose.Schema;
let Campaign = new Schema({
    ownerId: { type: String, required: true },
    name: { type: String, required: true, default: "" },
    image: { type: String, required: true, default: "" },
    players: [{type: mongoose.Schema.Types.ObjectId, ref: Token}],
    playerId: [{type: String, default: []}],
    lastMap: {
        name: {type: String, default: "none"},
        image: {type: String, default: ""},
        _id: {type: mongoose.Schema.Types.ObjectId}
    }
});

export default mongoose.model('Campaign', Campaign);

/* SPECIAL CASES

When updating maps, check if the name or image is being updated, 
then if campaign it belongs to has it as the last map,and if so 
update that as well.

Also when fetching populate players

*/