import mongoose from 'mongoose';
import { officialItem, addItemTypes } from '@jhbuchanan45/dnd-models';

const Item = mongoose.model('Item', officialItem);

addItemTypes(Item);

export default Item;
