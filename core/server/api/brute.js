var Brute = require('../model/brute');
var _ = require('lodash');
var get = require('../helper/get-data');

module.exports = {
    get: function () {
        return get.apply(Brute, arguments);
    },
    update: function (ip, options) {
        var obj = {};
        _.extend(obj, options);

        return Brute.findOneAndUpdateAsync({ip: ip}, obj);
    },
    create: function (options) {
        var brute = new Brute(options);
        _.extend(brute, options);

        return brute.saveAsync().spread(function (b) {
            return b;
        });
    },
    delete: function (ip) {
        return Brute.findOneAndRemoveAsync({ip: ip});
    },
    addIp: function (ip) {
        var now = new Date();
        return this.create({
            ip           : ip,
            count        : 0,
            lastVisit    : now,
            firstVisit   : now,
            failedCount  : 0,
            remainingTime: 0,
            resetCountDate: now
        });
    },
    getIp: function (ip) {
        return this.get({ip: ip}, 1, 1);
    },
};