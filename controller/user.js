import _ from 'lodash';

import * as userApi from '../api/user';
import logger from '../utils/logger';

export function getMyself(req, result, done) {
    done(result({ user: req.user }));
}

export async function getUserInfo(req, result, done) {
    const id = req.params.id;
    if (!id) {
        return done(result.error.common.formInvalid({ id: 'id不能为空' }));
    }
    try {
        const user = await userApi.byId(id);
        if (!user) {
            return done(result.error.user.notFound({ id }));
        }
        return done(result(_.pick(user.attributes, [
            'email',
            'id',
            'username',
            'bio',
            'website',
            'location',
        ])));
    } catch (e) {
        logger.error(e);
        return done(result.error.common.serverError(e));
    }
}

export async function updateUserInfo(req, result, done) {
    const id = req.params.id;
    req.checkBody({
        username: {
            isLength: {
                options: [{ min: 4, max: 20 }],
                errorMessage: '用户名长度最长为20个字符，最短为4个字符',
            },
        },
    });

    const errors = req.validationErrors();

    if (errors) {
        return done(result.error.common.formInvalid(errors));
    }

    if (!id) {
        return done(result.error.common.formInvalid({ id: 'id不能为空' }));
    }
    try {
        const user = await userApi.byId(id);
        try {
            const newUser = await userApi.update(user, req.body, req.user);
            return done(result(newUser.omit('password'), '修改资料成功'));
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
                errorMessage: '密码必须由8位以上的至少包含一个字母一个数字以及一个特殊字符构成',
            },
        },
        newPassword: {
            notEmpty: true,
            isPassword: {
                errorMessage: '密码必须由8位以上的至少包含一个字母一个数字以及一个特殊字符构成',
            },
        },
        repeatPassword: {
            notEmpty: true,
            isEqual: {
                options: [newPassword],
                errorMessage: '两次输入的密码不一致',
            },
            isPassword: {
                errorMessage: '密码必须由8位以上的至少包含一个字母一个数字以及一个特殊字符构成',
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
            return done(result(newUser.omit('password'), '更改密码成功'));
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
