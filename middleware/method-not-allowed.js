import wrap from '../utils/response-wrapper';

export default function (allowedMethod) {
    return wrap((req, res, done) => {
        done(res.error.common.methodNotAllowed(), {
            Allow: allowedMethod.join(','),
        });
    });
}
