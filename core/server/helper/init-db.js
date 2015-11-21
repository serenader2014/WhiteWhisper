var settingApi    = require('../api/setting');
var categoryApi   = require('../api/category');
var permissionApi = require('../api/permission');
var log           = require('./log');

var initDB = function () {
    return settingApi.get({}, 1, 1).then(function (data) {
        if (!data.total) {
            log.info('Create default blog setting');
            return settingApi.create(config.defaultBlogConfig);
        }
    }).then(function () {
        return categoryApi.get({}, 1, 1).then(function (data) {
            if (!data.total) {
                log.info('Create default category');
                return categoryApi.create(config.defaultCategory);
            }
        });
    }).then(function () {
        return permissionApi.get({}, 1, 1).then(function (data) {
            if (!data.total) {
                log.info('Create default permission suit');
                return permissionApi.create(config.defaultPermission).then(function () {
                    return permissionApi.create(config.guestPermission);
                });
            }
        });
    });
};

module.exports = initDB;