import passportLocal from 'passport-local';
import userApi       from '../api/user';
let LocalStrategy = passportLocal.Strategy;

export default function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        userApi.getById(id).then((result) => {
            if (result.total) {
                done(null, result.data[0]);
            } else {
                done('user not found');
            }
        }).catch((err) => {
            done(err);
        });
    });

    passport.use('local-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        let pwd = userApi.generatePassword(password);
        userApi.create({
            username: email.split('@')[0],
            email,
            auth: {
                local: {
                    email,
                    password: pwd
                }
            }
        }).then((user) => {
            done(null, user);
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        userApi.getByEmail(email).then((result) => {
            if (result.total) {
                let user = result.data[0];
                if (userApi.validatePassword(password, user.auth.local.password)) {
                    done(null, user);
                } else {
                    done(null, false, {message: 'Password incorrect.'});
                }
            } else {
                done(null, false, {message: 'User doesnt exist.'});
            }
        }).catch((err) => {
            done(err);
        });
    }));
}