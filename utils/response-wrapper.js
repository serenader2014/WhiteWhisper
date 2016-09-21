import getResponseMsg from './get-response-msg';

export default function responseWrapper(controller) {
    return (req, res, next) => {
        function done(msg, headers = {}) {
            Object.keys(headers).forEach(header => {
                res.set(header, headers[header]);
            });
            res.status(msg.status || 200).json(msg);
        }
        const lang = (req.user && req.user.language) || 'zh';
        return controller(req, getResponseMsg(lang), done, res, next);
    };
}
