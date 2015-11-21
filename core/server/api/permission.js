var Permission = require('../model').permission;
var get        = require('../helper/get-data');
var _          = require('lodash');

module.exports = {
    get: function () {
        return get.apply(Permission, arguments);
    },
    create: function (options) {
        var p = new Permission();
        _.extend(p, options);

        return p.saveAsync().spread(function (p) {
            return p;
        });
    },
    update: function (id, options) {
        var obj = {};
        _.extend(obj, options);

        return Permission.findByIdAndUpdateAsync(id, obj);
    },
    delete: function (id) {
        return Permission.findByIdAndRemoveAsync(id);
    },
    getById: function (id) {
        return this.get({_id: id}, 1,1);
    },
    getByName: function (name) {
        return this.get({name: name}, 1, 1);
    },
    getAll: function () {
        return this.get({}, 10, 1);
    },
};