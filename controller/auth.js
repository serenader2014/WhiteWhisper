import jwt from 'jsonwebtoken';
import _ from 'lodash';
import logger from '../utils/logger';
import User from '../api/user';
import result from '../utils/result';

export const auth = (req, res) => {
    req.checkBody({
        email: {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Email 不是合格的邮箱地址。',
            },
        },
        password: {
            notEmpty: true,
            isPassword: {
                errorMessage: '密码必须由8位以上的至少包含一个字母一个数字以及一个特殊字符构成',
            },
        },
    });

    const errors = req.validationErrors();

    if (errors) {
        res.json(result.common.formInvalid(errors));
        return;
    }

    const { email, password } = req.body;

    (async () => {
        try {
            const user = await User.checkIfExist({ email });
            if (!user) {
                return res.json(result.login.userNotExist({ email }));
            }
            const validatePassword = await user.validatePassword(password);
            if (!validatePassword) {
                return res.json(result.login.passwordIncorrect(password));
            }
            const token = jwt.sign(_.pick(user.attributes, [
                'id',
                'email',
                'username',
            ]), config.secret, {
                expiresIn: 86400,
            });
            await user.login();
            return res.json(result(_.extend(user.omit('password'), { token }), '登录成功！'));
        } catch (err) {
            logger.error(err);
            return res.json(result.common.serverError(err));
        }
    })();
};

export const register = (req, res) => {
    const {
        email,
        password,
    } = req.body;
    req.checkBody({
        email: {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Email 不是合格的邮箱地址。',
            },
        },
        password: {
            notEmpty: true,
            isPassword: {
                errorMessage: '密码必须由8位以上的至少包含一个字母一个数字以及一个特殊字符构成',
            },
        },
    });

    const errors = req.validationErrors();

    if (errors) {
        res.json(result.common.formInvalid(errors));
        return;
    }

    if (req.user) {
        res.json(result.login.alreadyLogin(_.pick(req.user, ['_id', 'email', 'username'])));
        return;
    }

    (async () => {
        try {
            const user = await User.byEmail(email);

            if (user) {
                return res.json(result.register.emailTaken());
            }
            const newUser = await User.create({ email, password });
            return res.json(result(newUser.omit('password'), '注册成功'));
        } catch (err) {
            logger.error(err);
            return res.status(502).json(result.common.serverError(err));
        }
    })();
};
