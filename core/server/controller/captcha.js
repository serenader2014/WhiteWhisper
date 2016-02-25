import captcha from '../api/captcha';

export default {
    generate (req, res) {
        let image = captcha.generate(req);
        res.set('Content-Type', 'image/png');
        res.send(image);
    },
    validate (req, res) {
        let result, num;
        num    = req.body.captcha;
        result = captcha.validate(req, num);
        if (result) {
            res.json({code: 0});
        } else {
            res.json({code: -1});
        }
    }
};