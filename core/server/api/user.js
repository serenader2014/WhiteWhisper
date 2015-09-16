var User       = require('../model').user;
var bcrypt     = require('bcrypt-nodejs');
module.exports = {
    getById: function (id) {
        return User.get({_id: id}, 1, 1);
    },
    getByEmail: function (email) {
        return User.get({email: email}, 1, 1);
    },
    getByUsername: function (username) {
        return User.get({username: username});
    },
    getAll: function (amount, page) {
        return User.get({}, amount, page);
    },
    create: function (data) {
        return User.create(data);
    },
    login: function (email, ip) {
        return User.get({email: email}, 1, 1).then(function (data) {
            var user = data.data[0];
            user.log.push({
                date: new Date(),
                type: 2,
                user: user.email,
                data: ip
            });
            return user.saveAsync();
        });
    },
    generatePassword: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    validatePassword: function (pwd1, pwd2) {
        return bcrypt.compareSync(pwd1, pwd2);
    }
};