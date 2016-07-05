import jwt from 'jsonwebtoken';
import _ from 'lodash';
// import post from './post';
import logger from '../utils/logger';
import User from '../api/user';
import result from '../utils/result';
import unidecode from 'unidecode';
// import permissionApi  from '../api/permission';
// import category       from './category';
// import user           from './user';
// import captcha        from './captcha';

const auth = (req, res) => {
    req.checkBody({
        email: {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Email 不是合格的邮箱地址。',
            },
        },
        password: {
            notEmpty: true,
            isLength: {
                options: [{ min: 6, max: 20 }],
                errorMessage: '密码必须由6到16个字符组成。',
            },
        },
    });

    const errors = req.validationErrors();

    if (req.user) {
        res.json(result.login.alreadyLogin(_.pick(req.user, ['_id', 'email', 'username'])));
        return;
    }

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

const register = (req, res) => {
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
            isLength: {
                options: [{ min: 6, max: 20 }],
                errorMessage: '密码必须由6到16个字符组成。',
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
            return res.json(result(_.pick(newUser, ['email', 'username', 'id']), '注册成功'));
        } catch (err) {
            logger.error(err);
            return res.status(502).json(result.common.serverError(err));
        }
    })();
};

const getMyself = (req, res) => {
    res.json(result({ user: req.user }));
};

const getUserInfo = (req, res) => {
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

const updateUserInfo = (req, res) => {
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

const deleteUser = (req, res) => {

};
export default { auth, register, getMyself, getUserInfo, updateUserInfo, deleteUser };
