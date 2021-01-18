import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let User = new Schema({
    
});

module.exports = mongoose.model('Todo', User);