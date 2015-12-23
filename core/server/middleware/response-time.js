export default function () {
    return (req, res, next) => {
        var _send = res.send;
        var now   = new Date();
        res.send = function () {
            res.set('X-Time', new Date().getTime() - now.getTime() + 'ms');
            res.set('Access-Control-Allow-Origin', '*');
            res.set('ACcess-Control-Allow-Headers', 'Content-Type');
            return _send.apply(this, arguments);
        };
        next();
    };
}