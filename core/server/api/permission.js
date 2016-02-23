import Permission from '../model/permission';
import get        from '../helper/get-data';
import _          from 'lodash';

export default {
    get () {
        return get.apply(Permission, arguments);
    },
    create (options) {
        var p = new Permission();
        _.extend(p, options);

        return p.saveAsync().spread((p) => {
            return p;
        });
    },
    update (id, options) {
        var obj = {};
        _.extend(obj, options);

        return Permission.findByIdAndUpdateAsync(id, obj);
    },
    delete (id) {
        return Permission.findByIdAndRemoveAsync(id);
    },
    getById (id) {
        return this.get({_id: id}, 1, 1);
    },
    getByName (name) {
        return this.get({name: name}, 1, 1);
    },
    getAll () {
        return this.get({}, 10, 1);
    }
};