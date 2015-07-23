var mongoose    = Promise.promisifyAll(require('mongoose'));
var _           = require('lodash');
var Schema      = mongoose.Schema;
var get         = require('../helper/get-data');
var BruteSchema = new Schema({
    ip            : String,
    count         : Number,
    failedCount   : Number,
    lastVisit     : Date,
    firstVisit    : Date,
    remainingTime : Number,
    resetCountDate: Date,
});

BruteSchema.statics.get = function () {
    return get.apply(this, arguments);
};
BruteSchema.statics.update = function (ip, options) {
    var obj = {};
    _.extend(obj, options);

    return this.findOneAndUpdateAsync({ip: ip}, obj);
};
BruteSchema.statics.create = function (options) {
    var brute = new this();
    _.extend(brute, options);

    return brute.saveAsync().spread(function (b) {
        return b;
    });
};
BruteSchema.statics.delete = function (ip) {
    return this.findOneAndRemoveAsync({ip: ip});
};
module.exports = mongoose.model('Brute', BruteSchema);