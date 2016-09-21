import * as User from '../api/user';
import logger from '../utils/logger';
import wrap from '../utils/response-wrapper';

export default function () {
    return wrap(async function checkOwner(req, result, done, res, next) {
        const id = req.params.id;
        try {
            const user = await User.byId(id);
            if (!user) {
                return done(result.error.user.notFound({ id }));
            }
            if (!req.user || user.id !== req.user.id) {
                return done(result.error.common.forbidden());
            }
            return next();
        } catch (e) {
            logger.error(e);
            return done(result.error.common.serverError(e));
        }
    });
}
