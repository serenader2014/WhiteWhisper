import jwt from 'jsonwebtoken';

export default function () {
    return (req, res, next) => {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
                /* eslint-disable no-param-reassign */
                if (!err) {
                    req.user = decoded;
                    req.lang = req.user.language || 'zh';
                }
                req.lang = 'zh';
                next();
            });
        } else {
            req.lang = 'zh';
            next();
        }
    };
}
