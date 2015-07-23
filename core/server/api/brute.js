var Brute = require('../model/brute');

module.exports = {
    addIp: function (ip) {
        var now = new Date();
        return Brute.create({
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
        return Brute.get({ip: ip}, 1, 1);
    },
    update: function (options) {
        return Brute.update(options.ip, options);
    }
};