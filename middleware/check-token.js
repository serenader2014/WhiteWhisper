import wrap from '../utils/response-wrapper';

export default function checkToken() {
    return wrap((req, result, done, res, next) => {
        if (req.user) {
            next();
        } else {
            done(result.error.common.unauthorized());
        }
    });
}
