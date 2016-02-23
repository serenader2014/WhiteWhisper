import Promise  from 'bluebird';
import mongoose from 'mongoose';
const mongo       = Promise.promisifyAll(mongoose);
const Schema      = mongo.Schema;
const BruteSchema = new Schema({
    ip            : String,
    count         : Number,
    failedCount   : Number,
    lastVisit     : Date,
    firstVisit    : Date,
    remainingTime : Number,
    resetCountDate: Date
});

export default mongo.model('Brute', BruteSchema);