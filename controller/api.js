import _              from 'lodash';
import jwt            from 'jsonwebtoken';
// import userApi        from '../api/user';
// import permissionApi  from '../api/permission';
// import post           from './post';
// import category       from './category';
// import user           from './user';
// import captcha        from './captcha';
import log            from '../utils/logger';
import User from '../model/user';

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

    User.checkIfExist({email, password}).then(data => {
        res.send(data);
    })

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
            res.json(result.register.emailTaken());
            return;
        }

        User.create(email, password).then(user => {
            res.send(user);
        });
    });

    // permissionApi.get({ name: config.defaultBlogConfig.defaultUserPermission }, 1, 1).then(data => {
    //     if (!data.total) {
    //         return Promise.reject(errorCode.getError('权限'));
    //     }
    //     return data.data[0];
    // }).then(permission => {
    //     userApi.getByEmail(email).then(findResult => {
    //         if (findResult.total) {
    //             res.json(errorCode.emailExist());
    //             return;
    //         }
    //         userApi.create({
    //             email,
    //             username: email,
    //             auth    : {
    //                 local: {
    //                     email,
    //                     password: userApi.generatePassword(password),
    //                 },
    //             },
    //             status    : 'active',
    //             permission: {
    //                 profileName: permission.name,
    //                 id         : permission._id,
    //             },
    //             log: [{
    //                 date: new Date(),
    //                 type: 1,
    //                 user: email,
    //             }],
    //         }).then(resultUser =>
    //             res.json(successCode('注册成功！', _.pick(resultUser, ['_id', 'email', 'username'])))
    //         );
    //     });
    // }, error => res.json(error));
};

const logout = (req, res) => {
    if (req.user) {
        req.logout();
        res.json(successCode('退出成功。'));
    } else {
        res.json(errorCode.notLogin());
    }
};

export default { login, register, logout };
