var Setting = require('../model').setting;
var get     = require('../helper/get-data');
var _       = require('lodash');

module.exports = {
    get: function () {
        return get.apply(Setting, arguments);
    },
    create: function (options) {
        var setting = new Setting();
        _.extend(setting, options);
        return setting.saveAsync().spread(function (setting) {
            return setting;
        });
    },
    update: function (id, options) {
        var obj = {};
        _.extend(obj, options);

        return Setting.findByIdAndUpdateAsync(id, obj);
    },
    delete: function (id) {
        return Setting.findByIdAndRemoveAsync(id);
    }
};