/* eslint-disable no-param-reassign */
export default function () {
    return (req, res, next) => {
        const originalSend = res.send;
        const now   = new Date();
        res.send = function send(...args) {
            res.set('X-Time', `${new Date().getTime() - now.getTime()} ms`);
            res.set('Access-Control-Allow-Origin', '*');
            res.set('ACcess-Control-Allow-Headers', 'Content-Type');
            return originalSend.apply(this, args);
        };
        next();
    };
}
