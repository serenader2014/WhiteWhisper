import getResponseMsg from './get-response-msg';

export default function responseWrapper(controller) {
    return (req, res, next) => {
        function done(msg, headers = {}) {
            Object.keys(headers).forEach(header => {
                res.set(header, headers[header]);
            });
            /* eslint-disable no-param-reassign */
            const status = msg.status || 200;
            delete msg.status;
            res.status(status).json(msg);
        }
        return controller(req, getResponseMsg(req.lang), done, res, next);
    };
}
