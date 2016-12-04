import * as userApi from '../api/user';
import logger from '../utils/logger';
import getResponseMsg from '../utils/get-response-msg';

export function getMyself(req, result, done) {
    done(result({ user: req.user }));
}

async function getInfo(type, value, req, result, done) {
    let method;
    switch (type) {
        case 'id':
            method = userApi.byId;
            break;
        case 'slug':
            method = userApi.bySlug;
            break;
        case 'emai':
        default:
            method = userApi.byEmail;
            break;
    }

    try {
        const user = await method(value);
        if (!user) {
            return done(result.error.user.notFound({ [type]: value }));
        }
        return done(result(user.structure(req.user)));
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}

export async function getUserInfo(req, result, done) {
    const id = req.params.id;
    getInfo('id', id, req, result, done);
}

export async function getUserInfoBySlug(req, result, done) {
    const { slug } = req.params;
    getInfo('slug', slug, req, result, done);
}

export async function getUserInfoByEmail(req, result, done) {
    const { email } = req.params;
    getInfo('email', email, req, result, done);
}

export async function updateUserInfo(req, result, done) {
    const id = req.params.id;
    req.checkBody({
        username: {
            isLength: {
                options: [{ min: 4, max: 20 }],
                errorMessage: getResponseMsg(req.lang).error.user.usernameLength().msg,
            },
        },
    });

    const errors = req.validationErrors();

    if (errors) {
        return done(result.error.common.formInvalid(errors));
    }

    try {
        const user = await userApi.byId(id);
        try {
            const newUser = await userApi.update(user, req.body, req.user);
            return done(result(newUser.structure(req.user)));
        } catch (e) {
            return done(e);
        }
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}

export async function changePassword(req, result, done) {
    const id = req.params.id;
    const {
        oldPassword,
        newPassword,
    } = req.body;

    req.checkBody({
        oldPassword: {
            notEmpty: true,
            isPassword: {
                errorMessage: getResponseMsg(req.lang).error.user.passwordFormat().msg,
            },
        },
        newPassword: {
            notEmpty: true,
            isPassword: {
                errorMessage: getResponseMsg(req.lang).error.user.passwordFormat().msg,
            },
        },
        repeatPassword: {
            notEmpty: true,
            isEqual: {
                options: [newPassword],
                errorMessage: getResponseMsg(req.lang).error.user.passwordInconsist().msg,
            },
            isPassword: {
                errorMessage: getResponseMsg(req.lang).error.user.passwordFormat().msg,
            },
        },
    });

    const errors = req.validationErrors();

    if (errors) {
        return done(result.error.common.formInvalid(errors));
    }

    try {
        const user = await userApi.byId(id);
        const isPasswordCorrect = await user.validatePassword(oldPassword);
        if (!isPasswordCorrect) {
            return done(result.error.user.passwordIncorrect(oldPassword));
        }
        try {
            const newUser = await userApi.update(user, { password: newPassword }, req.user);
            return done(result(newUser.structure(req.user)));
        } catch (e) {
            return done(e);
        }
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}

export async function list(req, result, done) {
    const options = {};
    let { pageSize, page } = req.query;
    pageSize = parseInt(pageSize, 10);
    page = parseInt(page, 10);

    if (!isNaN(pageSize)) {
        options.pageSize = pageSize;
    }

    if (!isNaN(page)) {
        options.page = page;
    }

    try {
        const users = await userApi.list(options);
        done(result(users));
    } catch (e) {
        logger.error(e);
        done(result.error.common.serverError(e));
    }
}
