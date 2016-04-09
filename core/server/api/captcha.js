import Captcha from 'captchapng';

function randomNumer(length) {
    return parseInt(Math.random() * length, 10);
}

/* eslint-disable no-param-reassign */
export default {
    generate(req) {
        const num = parseInt(Math.random() * 100000, 10);
        const id                      = req.query.id;
        req.session.captcha = req.session.captcha || {};
        req.session.captcha[id] = num;
        const captcha                 = new Captcha(100, 50, num);
        captcha.color(randomNumer(255), randomNumer(255), randomNumer(255), 1);
        captcha.color(randomNumer(255), randomNumer(255), randomNumer(255), 255);
        const img    = captcha.getBase64();
        return new Buffer(img, 'base64');
    },
    validate(req, num = 0) {
        const id = req.query.id;
        return req.session.captcha && req.session.captcha[id] &&
            req.session.captcha[id].toString() === num.toString();
    },
    clear(req) {
        const id = req.query.id;
        if (req.session.captcha) {
            delete req.session.captcha[id];
        }
    },
};
