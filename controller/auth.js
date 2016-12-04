import _ from 'lodash';
import logger from '../utils/logger';
import * as userApi from '../api/user';
import getResponseMsg from '../utils/get-response-msg';

export async function auth(req, result, done) {
    req.checkBody({
        email: {
            notEmpty: true,
            isEmail: {
                errorMessage: getResponseMsg(req.lang).error.user.emailFormat().msg,
            },
        },
        password: {
            notEmpty: true,
            isPassword: {
                errorMessage: getResponseMsg(req.lang).error.user.passwordFormat().msg,
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
        return done(result(_.extend(user.structure(req.user), { token })));
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
                errorMessage: getResponseMsg(req.lang).error.user.emailFormat().msg,
            },
        },
        password: {
            notEmpty: true,
            isPassword: {
                errorMessage: getResponseMsg(req.lang).error.user.passwordFormat().msg,
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
        return done(_.extend(result(newUser.structure(req.user)), { status: 201 }), {
            Location: `${global.config.url}/api/v1/users/${newUser.id}`,
        });
    } catch (err) {
        logger.error(err);
        return done(502).json(result.error.common.serverError(err));
    }
}
