import Captcha from 'captchapng';

function randomNumer (length) {
    return parseInt(Math.random() * length, 10);
}

export default {
    generate (req, res) {
        let captcha, img, buffer;
        const num = parseInt(Math.random() * 100000, 10);
        req.session.captcha = num;
        captcha = new Captcha(100, 50, num);
        captcha.color(randomNumer(255), randomNumer(255), randomNumer(255), 1);
        captcha.color(randomNumer(255), randomNumer(255), randomNumer(255), 255);
        img    = captcha.getBase64();
        buffer = new Buffer(img, 'base64');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    }
};