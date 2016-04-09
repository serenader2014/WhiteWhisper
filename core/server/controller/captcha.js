import captchaApi from '../api/captcha';

export default {
    generate(req, res) {
        const image = captchaApi.generate(req);
        res.set('Content-Type', 'image/png');
        res.send(image);
    },
    validate(req, res) {
        const num    = req.body.captcha;
        const result = captchaApi.validate(req, num);
        if (result) {
            res.json({ code: 0 });
        } else {
            res.json({ code: -1 });
        }
    },
};
