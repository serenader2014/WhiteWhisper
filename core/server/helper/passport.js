var LocalStrategy = require('passport-local').Strategy;
var api           = require('../api');
var userApi       = api.user;

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        userApi.getById(id).then(function (result) {
            if (result.total) {
                done(null, result.data[0]);
            } else {
                done('user not found');
            }
        }).catch(function (err) {
            done(err);
        });
    });

    passport.use('local-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        var pwd = userApi.generatePassword(password);
        userApi.create({
            username: email.split('@')[0],
            email: email,
            auth: {
                local: {
                    email: email,
                    password: pwd
                }
            }
        }).then(function (user) {
            done(null, user);
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        userApi.getByEmail(email).then(function (result) {
            if (result.total) {
                var user = result.data[0];
                if (userApi.validatePassword(password, user.auth.local.password)) {
                    done(null, user);
                } else {
                    done(null, false, {message: 'Password incorrect.'});
                }
            } else {
                done(null, false, {message: 'User doesnt exist.'});
            }
        }).catch(function (err) {
            done(err);
        });
    }));
};