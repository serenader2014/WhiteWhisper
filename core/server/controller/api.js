import passport       from 'passport';
import _              from 'lodash';
import userApi        from '../api/user';
import permissionApi  from '../api/permission';
import post           from './post';
import category       from './category';
import user           from './user';
import captcha        from './captcha';
import passportHelper from '../helper/passport';
import log            from '../helper/log';

import * as errorCode from '../../shared/constants/error-code';
import successCode    from '../../shared/constants/success-code';

passportHelper(passport);

const login = (req, res, next) => {
    req.checkBody('email', 'Email 不是合格的邮箱地址。')
        .notEmpty().withMessage('Email 为空。')
        .isEmail();
    req.checkBody('password', '密码为空。')
        .isLength(6, 16).withMessage('密码必须由6到16个字符组成。')
        .notEmpty();

    const errors = req.validationErrors();

    if (req.user) {
        res.json(errorCode.alreadyLogin(_.pick(req.user, ['_id', 'email', 'username'])));
        return;
    }

    if (errors) {
        res.json(errorCode.formInvalid(errors));
        return;
    }
    passport.authenticate('local-login', (err, targetUser, errMsg) => {
        if (err) {
            res.json(errorCode.internalError(err.message));
            log.error(err);
            return;
        }

        if (errMsg) {
            res.json(errorCode.authError(errMsg.message));
            return;
        }

        if (!targetUser) {
            res.json(errorCode.emailNotExist());
            return;
        }

        req.login(targetUser, error => {
            if (error) {
                res.json(errorCode.internalError(error.message));
                log.error(error);
                return;
            }
            userApi.login(targetUser.email, req.ip).then(() => res.json(successCode('登录成功！')));
        });
    })(req, res, next);
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
        res.json(errorCode.formInvalid(errors));
        return;
    }

    if (req.user) {
        res.json(errorCode.alreadyLogin(_.pick(req.user, ['_id', 'email', 'username'])));
        return;
    }

    permissionApi.get({ name: config.defaultBlogConfig.defaultUserPermission }, 1, 1).then(data => {
        if (!data.total) {
            return Promise.reject(errorCode.getError('权限'));
        }
        return data.data[0];
    }).then(permission => {
        userApi.getByEmail(email).then(findResult => {
            if (findResult.total) {
                res.json(errorCode.emailExist());
                return;
            }
            userApi.create({
                email,
                username: email,
                auth    : {
                    local: {
                        email,
                        password: userApi.generatePassword(password),
                    },
                },
                status    : 'active',
                permission: {
                    profileName: permission.name,
                    id         : permission._id,
                },
                log: [{
                    date: new Date(),
                    type: 1,
                    user: email,
                }],
            }).then(resultUser =>
                res.json(successCode('注册成功！', _.pick(resultUser, ['_id', 'email', 'username'])))
            );
        });
    }, error => res.json(error));
};

const logout = (req, res) => {
    if (req.user) {
        req.logout();
        res.json(successCode('退出成功。'));
    } else {
        res.json(errorCode.notLogin());
    }
};

export default { login, register, logout, post, category, user, captcha };
