import jwt from 'jsonwebtoken';
import _ from 'lodash';
// import userApi        from '../api/user';
// import permissionApi  from '../api/permission';
// import post           from './post';
// import category       from './category';
// import user           from './user';
// import captcha        from './captcha';
import logger from '../utils/logger';
import User from '../api/user';

import result from '../utils/result';

const auth = (req, res) => {
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

    User.checkIfExist({ email }).then(user => {
        if (!user) {
            return result.login.userNotExist({ email });
        }
        return User.validatePassword(password, user.get('password')).then(data => {
            if (!data) {
                return result.login.passwordIncorrect(password);
            }
            const token = jwt.sign(_.pick(user.attributes, [
                'id',
                'email',
                'username',
            ]), config.secret, {
                expiresIn: 86400,
            });
            return result(_.extend(user.omit('password'), { token }), '登录成功！');
        });
    }).then(data => res.json(data)).catch(err => {
        logger.error(err);
        res.json(result.common.serverError(err));
    });
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

        return User.create({ email, password })
            .then(newUser => result(_.pick(newUser, ['email', 'username', 'id']), '注册成功'));
    }).then(data => res.json(data), err => {
        logger.error(err);
        res.status(502).json(result.common.serverError(err));
    });
};

const getUserInfo = (req, res) => {
    if (req.user) {
        res.json(result({ user: req.user }));
    } else {
        res.json(result.common.permissionDeny());
    }
};

export default { auth, register, getUserInfo };
