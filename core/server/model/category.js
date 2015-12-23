import Promise  from 'bluebird';
import mongoose from 'mongoose';
const mongo          = Promise.promisifyAll(mongoose);
const Schema         = mongo.Schema;
const CategorySchema = new Schema({
    name: {type: String, unique: true},
    count: {type: Number, default: 0}
});

export default mongo.model('Category', CategorySchema);