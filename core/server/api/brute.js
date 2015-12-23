import Brute from '../model/brute';
import _     from 'lodash';
import get   from '../helper/get-data';
export default  {
    get () {
        return get.apply(Brute, arguments);
    },
    update (ip, options) {
        var obj = {};
        _.extend(obj, options);

        return Brute.findOneAndUpdateAsync({ip: ip}, obj);
    },
    create (options) {
        var brute = new Brute(options);
        _.extend(brute, options);

        return brute.saveAsync().spread(function (b) {
            return b;
        });
    },
    delete (ip) {
        return Brute.findOneAndRemoveAsync({ip: ip});
    },
    addIp (ip) {
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
    getIp (ip) {
        return this.get({ip: ip}, 1, 1);
    },
};