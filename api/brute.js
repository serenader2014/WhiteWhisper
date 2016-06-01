import Brute from '../model/brute';
import _     from 'lodash';
import get   from '../helper/get-data';
export default {
    get(...args) {
        return get.apply(Brute, args);
    },
    update(ip, options) {
        const obj = {};
        _.extend(obj, options);

        return Brute.findOneAndUpdateAsync({ ip }, obj);
    },
    create(options) {
        const brute = new Brute(options);
        _.extend(brute, options);

        return brute.saveAsync().spread((b) => {
            const result = b;
            return result;
        });
    },
    delete(ip) {
        return Brute.findOneAndRemoveAsync({ ip });
    },
    addIp(ip) {
        const now = new Date();
        return this.create({
            ip,
            count         : 0,
            lastVisit     : now,
            firstVisit    : now,
            failedCount   : 0,
            remainingTime : 0,
            resetCountDate: now,
        });
    },
    getIp(ip) {
        return this.get({ ip }, 1, 1);
    },
};
