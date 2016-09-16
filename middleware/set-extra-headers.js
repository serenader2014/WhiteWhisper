/* eslint-disable no-param-reassign */
export default function () {
    return (req, res, next) => {
        // cors headers
        res.set('Access-Control-Allow-Origin', '*');
        res.set('ACcess-Control-Allow-Headers', 'Content-Type');

        // response time
        const originalSend = res.send;
        const now = new Date();
        res.send = function send(...args) {
            res.set('X-Time', `${new Date().getTime() - now.getTime()} ms`);
            return originalSend.apply(this, args);
        };
        next();
    };
}
