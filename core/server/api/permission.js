import Permission from '../model/permission';
import get        from '../helper/get-data';
import _          from 'lodash';

export default {
    get(...args) {
        return get.apply(Permission, args);
    },
    create(options) {
        const p = new Permission();
        _.extend(p, options);

        return p.saveAsync().spread((permission) => {
            const result = permission;
            return result;
        });
    },
    update(id, options) {
        const obj = {};
        _.extend(obj, options);

        return Permission.findByIdAndUpdateAsync(id, obj);
    },
    delete(id) {
        return Permission.findByIdAndRemoveAsync(id);
    },
    getById(id) {
        return this.get({ _id: id }, 1, 1);
    },
    getByName(name) {
        return this.get({ name }, 1, 1);
    },
    getAll() {
        return this.get({}, 10, 1);
    },
};
