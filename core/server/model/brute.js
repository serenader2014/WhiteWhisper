var mongoose    = Promise.promisifyAll(require('mongoose'));
var Schema      = mongoose.Schema;
var BruteSchema = new Schema({
    ip            : String,
    count         : Number,
    failedCount   : Number,
    lastVisit     : Date,
    firstVisit    : Date,
    remainingTime : Number,
    resetCountDate: Date,
});
module.exports = mongoose.model('Brute', BruteSchema);