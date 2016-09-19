import jwt from 'jsonwebtoken';
import _ from 'lodash';
import logger from '../utils/logger';
import * as userApi from '../api/user';
import result from '../utils/result';

export async function auth(req, res) {
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
        return res.json(result.common.formInvalid(errors));
    }

    const { email, password } = req.body;

    try {
        const user = await userApi.checkIfExist({ email });
        if (!user) {
            return res.json(result.login.userNotExist({ email }));
        }
        const validatePassword = await user.validatePassword(password);
        if (!validatePassword) {
            return res.json(result.login.passwordIncorrect(password));
        }

        const token = await user.login();
        return res.json(result(_.extend(user.omit('password'), { token }), '登录成功！'));
    } catch (err) {
        logger.error(err);
        return res.json(result.common.serverError(err));
    }
}

export async function register(req, res) {
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
        return res.json(result.common.formInvalid(errors));
    }

    if (req.user) {
        return res.json(result.login.alreadyLogin(_.pick(req.user, [
            '_id', 'email', 'username',
        ])));
    }

    try {
        const user = await userApi.byEmail(email);

        if (user) {
            return res.json(result.register.emailTaken());
        }
        const newUser = await userApi.create({ email, password });
        return res.json(result(newUser.omit('password'), '注册成功'));
    } catch (err) {
        logger.error(err);
        return res.status(502).json(result.common.serverError(err));
    }
}
