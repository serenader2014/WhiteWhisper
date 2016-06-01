import captchaApi     from '../api/captcha';
import successCode    from '../../shared/constants/success-code';
import * as errorCode from '../../shared/constants/error-code';

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
            res.json(successCode('验证成功'));
        } else {
            res.json(errorCode.captchaError());
        }
    },
};
