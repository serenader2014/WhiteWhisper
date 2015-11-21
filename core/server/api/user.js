var User       = require('../model').user;
var bcrypt     = require('bcrypt-nodejs');
var _          = require('lodash');
var get        = require('../helper/get-data');

module.exports = {
    get: function () {
        return get.apply(User, arguments);
    },
    create: function (options) {
        var user = new User();
        _.extend(user, options);

        return user.saveAsync().spread(function (user) {
            return user;
        });
    },
    update: function (id, options) {
        var obj = {};
        _.extend(obj, options);

        return User.findByIdAndUpdateAsync(id, obj);
    },
    delete: function (id) {
        return User.findByIdAndRemoveAsync(id);
    },
    check: function (username, email) {
        return User.findAsync({ $or: [{username: username}, {email: email}]});
    },
    getById: function (id) {
        return this.get({_id: id}, 1, 1);
    },
    getByEmail: function (email) {
        return this.get({email: email}, 1, 1);
    },
    getByUsername: function (username) {
        return this.get({username: username});
    },
    getAll: function (amount, page) {
        return this.get({}, amount, page);
    },
    login: function (email, ip) {
        return this.get({email: email}, 1, 1).then(function (data) {
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