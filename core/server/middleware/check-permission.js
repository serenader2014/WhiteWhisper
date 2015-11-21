var permissionApi = require('../api').permission;
var log = require('../helper/log');
var checkPermission = function (type, method) {
    return function (req, res, next) {
        var user = req.user;
        (function () {
            if (user) {
                return permissionApi.getById(user.permission.id).then(function (data) {
                    if (!data.total) {
                        throw {code: -1, msg: '找不到权限数据。', data: user.permission.id};                        
                    }
                    return data.data[0]._doc;
                });
            } else {
                return Promise.resolve(config.guestPermission);
            }
        })().then(function (permission) {
            if (permission[type][method]) {
                next();
            } else {
                res.status(401).json({
                    code: -1,
                    msg: '权限不足。'
                });
            }
        }).catch(function (err) {
            res.json(err);
            log.error(err);
        });
    };
};

module.exports = checkPermission;