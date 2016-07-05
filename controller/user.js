import unidecode from 'unidecode';
import _ from 'lodash';

import result from '../utils/result';
import User from '../api/user';
import logger from '../utils/logger';

export const getMyself = (req, res) => {
    res.json(result({ user: req.user }));
};

export const getUserInfo = (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json(result.common.formInvalid({ id: 'id不能为空' }));
    }
    return (async () => {
        try {
            const user = await User.byId(id);
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
    })();
};

export const updateUserInfo = (req, res) => {
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
    const newUserInfo = _.pick(req.body, [
        'username',
        'image',
        'cover',
        'bio',
        'website',
        'location',
        'language',
    ]);
    if (!id) {
        return res.json(result.common.formInvalid({ id: 'id不能为空' }));
    }
    return (async () => {
        try {
            const user = await User.byId(id);
            if (!user) {
                return res.json(result.user.userNotExist({ id }));
            }
            if (user.id !== req.user.id) {
                return res.json(result.user.noPermission());
            }
            if (newUserInfo.username) {
                const ifExist = await User.byUsername(newUserInfo.username);
                if (ifExist) {
                    return res.json(result.user.usernameTaken({ username: newUserInfo.username }));
                }
                newUserInfo.slug = unidecode(newUserInfo.username)
                    .toLowerCase()
                    .replace(/(\s)|(\W)/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/(^-)|(-$)/, '');
            }
            newUserInfo.updated_at = new Date();
            newUserInfo.updated_by = req.user.id;
            for (const i of Object.keys(newUserInfo)) {
                user.set(i, newUserInfo[i]);
            }
            const newUser = await user.save();
            return res.json(result({ user: newUser.omit('password') }, '修改资料成功'));
        } catch (e) {
            logger.error(e);
            return res.json(result.common.serverError(e));
        }
    })();
};

export const deleteUser = (req, res) => {

};
