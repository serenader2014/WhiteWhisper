import jwt from 'jsonwebtoken';
import _              from 'lodash';
// import userApi        from '../api/user';
// import permissionApi  from '../api/permission';
// import post           from './post';
// import category       from './category';
// import user           from './user';
// import captcha        from './captcha';
import logger            from '../utils/logger';
import User from '../api/user';

import result from '../utils/result';

const login = (req, res) => {
    req.checkBody('email', 'Email 不是合格的邮箱地址。')
        .notEmpty().withMessage('Email 为空。')
        .isEmail();
    req.checkBody('password', '密码为空。')
        .isLength(6, 16).withMessage('密码必须由6到16个字符组成。')
        .notEmpty();

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

    User.checkIfExist({email}).then(user => {
        if (!user) {
            return result.login.userNotExist({email});
        }
        return User.validatePassword(password, user.get('password')).then(res => {
            if (!res) {
                return result.login.passwordIncorrect(password);
            }
            const token = jwt.sign(_.pick(user.attributes, ['id', 'email', 'username']), config.secret, {
                expiresIn: 86400,
            });
            return result(_.extend(user.omit('password'), {token}), '登录成功！');
        });
    }).then(data => res.json(data)).catch(err => {
        logger.error(err);
        res.json(result.common.serverError(err));
    });

    // userApi.getByEmail(email).then(data => {
    //     if (!data.total) {
    //         res.json(errorCode.getError('用户'));
    //         return;
    //     }
    //     const targetUser = data.data[0];
    //     if (userApi.validatePassword(password, targetUser.password)) {
    //         const token = jwt.sign(_.pick(targetUser, ['_id', 'email', 'username', 'permission']), config.secret, {
    //             expiresIn: 86400,
    //         });

    //         userApi.login(targetUser.email, req.ip).then(() => res.json(successCode('登录成功！', { token })));
    //     }
    // });
};

const register = (req, res) => {
    const {
        email,
        password,
    } = req.body;

    req.checkBody('email', 'Email 不是合格的邮箱地址。')
        .notEmpty().withMessage('Email 为空。')
        .isEmail();
    req.checkBody('password', '密码为空。')
        .isLength(6, 16).withMessage('密码必须由6到16个字符组成。')
        .notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        res.json(result.common.formInvalid(errors));
        return;
    }

    if (req.user) {
        res.json(result.login.alreadyLogin(_.pick(req.user, ['_id', 'email', 'username'])));
        return;
    }

    User.byEmail(email).then(user => {
        if (user) {
            return result.register.emailTaken();
        }

        return User.create({email, password}).then(user =>{
            return result(_.pick(user, ['email', 'username', 'id']), '注册成功');
        });
    }).then(data => res.json(data), err => {
        logger.error(err);
        res.status(502).json(result.common.serverError(err));
    });
};

const logout = (req, res) => {
    if (req.user) {
        req.logout();
        res.json(successCode('退出成功。'));
    } else {
        res.json(errorCode.notLogin());
    }
};

const getUserInfo = (req, res) => {
    res.json(req.user);
};

export default { login, register, logout, getUserInfo };
