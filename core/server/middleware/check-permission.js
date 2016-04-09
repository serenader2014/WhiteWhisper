import permissionApi from '../api/permission';
import log from '../helper/log';
export default function (type, method) {
    return function checkPermission(req, res, next) {
        const user = req.user;
        (() => {
            if (user) {
                return permissionApi.getById(user.permission.id).then((data) => {
                    if (!data.total) {
                        throw new Error({
                            code: -1,
                            msg : '找不到权限数据。',
                            data: user.permission.id,
                        });
                    }
                    return data.data[0]._doc;
                });
            }
            return Promise.resolve(config.guestPermission);
        })().then((permission) => {
            if (permission[type][method]) {
                next();
            } else {
                res.status(401).json({
                    code: -1,
                    msg : '权限不足。',
                });
            }
        }).catch((err) => {
            res.json(err);
            log.error(err);
        });
    };
}
