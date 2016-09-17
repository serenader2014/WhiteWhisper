import * as User from '../api/user';
import logger from '../utils/logger';
import result from '../utils/result';

export default function () {
    return async function checkOwner(req, res, next) {
        const id = req.params.id;
        try {
            const user = await User.byId(id);
            if (!user) {
                return res.json(result.user.userNotExist({ id }));
            }
            if (!req.user || user.id !== req.user.id) {
                return res.json(result.common.permissionDeny());
            }
            return next();
        } catch (e) {
            logger.error(e);
            return res.json(result.common.serverError(e));
        }
    };
}
