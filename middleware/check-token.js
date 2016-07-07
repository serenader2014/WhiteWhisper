import result from '../utils/result';

export default function authCheck() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.json(result.common.permissionDeny());
        }
    };
}
