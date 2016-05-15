import permissionApi from '../api/permission';
import * as errorCode from '../../shared/constants/error-code';
import log from '../helper/log';

export default function (type, method) {
    return function checkPermission(req, res, next) {
        const user = req.user;
        (() => {
            if (user) {
                return permissionApi.getById(user.permission.id).then((data) => {
                    if (!data.total) {
                        return Promise.reject(errorCode.getError('权限'));
                    }
                    return data.data[0]._doc;
                });
            }
            return Promise.resolve(config.guestPermission);
        })().then((permission) => {
            if (permission[type][method]) {
                next();
            } else {
                res.status(401).json(errorCode.noPermission());
            }
        }).catch((err) => {
            res.json(err);
            log.error(err);
        });
    };
}
