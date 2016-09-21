import getResponseMsg from './get-response-msg';

export default function responseWrapper(controller) {
    return (req, res, next) => {
        function done(msg, headers = {}) {
            Object.keys(headers).forEach(header => {
                res.set(header, headers[header]);
            });
            res.status(msg.status || 200).json(msg);
        }
        return controller(req, getResponseMsg(req.lang), done, res, next);
    };
}
