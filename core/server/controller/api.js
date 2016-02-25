/**
 * response code:
 * 0: 请求成功
 * -1: 权限不足
 * -2: 数据不全
 * -3: 数据格式错误
 * -4: 数据已存在
 * -5: 数据不存在
 * 1: 系统错误
 */


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

passportHelper(passport);

const login = (req, res, next) => {
    let errors;
    req.checkBody('email', 'Email 不是合格的邮箱地址。')
        .notEmpty().withMessage('Email 为空。')
        .isEmail();
    req.checkBody('password', '密码为空。')
        .isLength(6, 16).withMessage('密码必须由6到16个字符组成。')
        .notEmpty();

    errors = req.validationErrors();

    if (req.user) {
        res.json({code: -1, msg: '已经登陆。', data: _.pick(req.user, ['_id', 'email', 'username'])});
        return;
    }
    if (errors) {
        res.json({code: -3, msg: '表单数据有误。', data: errors});
        return;
    }
    passport.authenticate('local-login', (err, user, errMsg) => {
        if (err) {
            res.json({code: 1, msg: err.message});
            log.error(err);
            return;
        }
        if (errMsg) {
            res.json({code: -5, msg: errMsg.message});
            return;
        }
        if (!user) {
            res.json({code: -5, msg: '该Email未注册。'});
            return;
        }
        req.login(user, (err) => {
            if (err) {
                res.json({code: 1, msg: err.message});
                log.error(err);
                return;
            }
            userApi.login(user.email, req.ip).then(() => {
                res.json({code: 0, msg: '登陆成功。'});
            });
        });

    })(req, res, next);
};

const register = (req, res) => {
    let errors;
    let email        = req.body.email;
    let password     = req.body.password;
    let permissionId = req.body.permission;
    req.checkBody('email', 'Email 不是合格的邮箱地址。')
        .notEmpty().withMessage('Email 为空。')
        .isEmail();
    req.checkBody('password', '密码为空。')
        .isLength(6, 16).withMessage('密码必须由6到16个字符组成。')
        .notEmpty();

    errors = req.validationErrors();

    if (errors) {
        res.json({code: -3, msg: '表单数据有误。', data: errors});
        return;
    }
    
    if (req.user) {
        res.json({code: -1, msg: '已经登陆。', data: _.pick(req.user, ['_id', 'email', 'username'])});
        return;
    }
    ((id) => {
        if (id) {
            return permissionApi.getById(id);
        } else {
            return permissionApi.get({name: config.defaultUserPermission}, 1, 1);
        }
    })(permissionId).then((data) => {
        if (!data.total) {
            res.json({code: -5, msg: '获取权限数据失败！'});
            return;
        }
        let permission = data.data[0];
        userApi.getByEmail(email).then((data) => {
            if (data.total) {
                res.json({code: -4, msg: '该Email已注册。'});
                return;
            }
            userApi.create({
                username: email,
                email,
                auth: {
                    local: {
                        email,
                        password: userApi.generatePassword(password)
                    }
                },
                status: 'active',
                permission: {
                    profileName: permission.name,
                    id: permission._id
                },
                log: [{
                    date: new Date(),
                    type: 1,
                    user: email
                }]
            }).then((user) => {
                res.json({code: 0, msg: '注册成功。', data: _.pick(user, ['_id', 'email', 'username'])});
            });
        });
    });
};

const logout = (req, res) => {
    if (req.user) {
        req.logout();
        res.json({code: 0, msg: '退出成功。'});
    } else {
        res.json({code: -1, msg: '未登陆。'});
    }
};

export default {login, register, logout, post, category, user, captcha};