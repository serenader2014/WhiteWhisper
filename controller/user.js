import _ from 'lodash';

import result from '../utils/result';
import * as userApi from '../api/user';
import logger from '../utils/logger';

export function getMyself(req, res) {
    res.json(result({ user: req.user }));
}

export async function getUserInfo(req, res) {
    const id = req.params.id;
    if (!id) {
        return res.json(result.common.formInvalid({ id: 'id不能为空' }));
    }
    try {
        const user = await userApi.byId(id);
        if (!user) {
            return res.json(result.user.userNotExist({ id }));
        }
        return res.json(result(_.pick(user.attributes, [
            'email',
            'id',
            'username',
            'bio',
            'website',
            'location',
        ])));
    } catch (e) {
        logger.error(e);
        return res.json(result.common.serverError(e));
    }
}

export async function updateUserInfo(req, res) {
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
        return res.json(result.common.formInvalid(errors));
    }

    if (!id) {
        return res.json(result.common.formInvalid({ id: 'id不能为空' }));
    }
    try {
        const user = await userApi.byId(id);
        try {
            const newUser = await userApi.update(user, req.body, req.user);
            return res.json(result(newUser.omit('password'), '修改资料成功'));
        } catch (e) {
            return res.json(e);
        }
    } catch (e) {
        logger.error(e);
        return res.json(result.common.serverError(e));
    }
}

export async function changePassword(req, res) {
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
        return res.json(result.common.formInvalid(errors));
    }

    return (async () => {
        try {
            const user = await userApi.byId(id);
            const isPasswordCorrect = await user.validatePassword(oldPassword);
            if (!isPasswordCorrect) {
                return res.json(result.user.passwordIncorrect(oldPassword));
            }
            try {
                const newUser = await userApi.update(user, { password: newPassword }, req.user);
                return res.json(result(newUser.omit('password'), '更改密码成功'));
            } catch (e) {
                return res.json(e);
            }
        } catch (e) {
            logger.error(e);
            return res.json(result.common.serverError(e));
        }
    })();
}

export async function list(req, res) {
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
        res.json(result(users));
    } catch (e) {
        logger.error(e);
        res.json(result.common.serverError(e));
    }
}
