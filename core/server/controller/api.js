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


var userApi = require('../api').user;
var passport = require('passport');
var _ = require('lodash');

require('../helper/passport')(passport);

var login = function (req, res, next) {
    var errors;
    req.checkBody('email', 'Email 不是合格的邮箱地址。')
        .notEmpty().withMessage('Email 为空。')
        .isEmail();
    req.checkBody('password', '密码为空。')
        .isLength(6, 16).withMessage('密码必须由6到16个字符组成。')
        .notEmpty();

    errors = req.validationErrors();

    if (errors) {
        res.json({code: -3, msg: '表单数据有误。', data: errors});
    } else {
        if (req.user) {
            res.json({code: -1, msg: '已经登陆。', data: _.pick(req.user, ['_id', 'email', 'username'])});
            return;
        }
        passport.authenticate('local-login', function (err, user) {
            if (err) {
                res.json({code: 1, msg: err.message});
                console.log(err.stack);
                return;
            }
            if (!user) {
                res.json({code: -5, msg: '该Email未注册。'});
                return;
            }
            req.login(user, function (err) {
                if (err) {
                    res.json({code: 1, msg: err.message});
                    return;
                }
                userApi.login(user.email, req.ip).then(function () {
                    res.json({code: 0, msg: '登陆成功。'});
                });
            });

        })(req, res, next);
    }
};

var register = function (req, res) {
    var errors;
    var email = req.body.email;
    var password = req.body.password;
    req.checkBody('email', 'Email 不是合格的邮箱地址。')
        .notEmpty().withMessage('Email 为空。')
        .isEmail();
    req.checkBody('password', '密码为空。')
        .isLength(6, 16).withMessage('密码必须由6到16个字符组成。')
        .notEmpty();

    errors = req.validationErrors();

    if (errors) {
        res.json({code: -3, msg: '表单数据有误。', data: errors});
    } else {
        userApi.getByEmail(email).then(function (data) {
            if (data.total) {
                res.json({code: -4, msg: '该Email已注册。'});
            } else {
                userApi.create({
                    username: email,
                    email: email,
                    auth: {
                        local: {
                            email: email,
                            password: userApi.generatePassword(password)
                        }
                    },
                    status: 'active',
                    log: [{
                        date: new Date(),
                        type: 1,
                        user: email
                    }]
                }).then(function (user) {
                    res.json({code: 0, msg: '注册成功。', data: _.pick(user, ['_id', 'email', 'username'])});
                });
            }
        });
    }
};

var logout = function (req, res) {
    if (req.user) {
        req.logout();
        res.json({code: 0, msg: '退出成功。'});
    } else {
        res.json({code: -1, msg: '未登陆。'});
    }
};

module.exports.login = login;
module.exports.register = register;
module.exports.logout = logout;