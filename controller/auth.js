import _ from 'lodash';
import logger from '../utils/logger';
import * as userApi from '../api/user';

export async function auth(req, result, done) {
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
        return done(result.error.common.formInvalid(errors));
    }

    const { email, password } = req.body;

    try {
        const user = await userApi.checkIfExist({ email });
        if (!user) {
            return done(result.error.user.notFound({ email }));
        }
        const validatePassword = await user.validatePassword(password);
        if (!validatePassword) {
            return done(result.error.user.passwordIncorrect(password));
        }

        const token = await user.login();
        return done(result(_.extend(user.omit('password'), { token }), '登录成功！'));
    } catch (err) {
        logger.error(err);
        return done(result.error.common.serverError(err));
    }
}

export async function register(req, result, done) {
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
        return done(result.error.common.formInvalid(errors));
    }

    if (req.user) {
        return done(result.error.user.alreadyLogin(_.pick(req.user, [
            '_id', 'email', 'username',
        ])));
    }

    try {
        const user = await userApi.byEmail(email);

        if (user) {
            return done(result.error.user.emailUsed());
        }
        const newUser = await userApi.create({ email, password });
        return done(result(newUser.omit('password'), '注册成功'));
    } catch (err) {
        logger.error(err);
        return done(502).json(result.error.common.serverError(err));
    }
}
