/**
 * UserSchema log:
 * log: [{
 *     date: TIMESTAMP,
 *     type: => class Type,
 *     user: 执行操作的用户,
 *     data: 额外的数据
 * }]
 * Type {
 *     1: 用户创建,
 *     2: 登陆
 *     3: 资料修改,
 *     4: 状态修改
 * }
 */


var mongoose   = Promise.promisifyAll(require('mongoose'));
var _          = require('lodash');
var Schema     = mongoose.Schema;
var get        = require('../helper/get-data');
var ObjectId   = Schema.Types.ObjectId;
var UserSchema = new Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    auth: {
        local: {
            email   : String,
            password: String
        }
    },
    permission: {
        profileName: String,
        id         : ObjectId
    },
    avatar   : String,
    cover    : String,
    signature: String,
    social   : Array,
    status   : String,
    log      : Array
});

UserSchema.statics.get = function () {
    return get.apply(this, arguments);
};

UserSchema.statics.create = function (options) {
    var user = new this();
    _.extend(user, options);

    return user.saveAsync().spread(function (user) {
        return user;
    });
};

UserSchema.statics.update = function (id, options) {
    var obj = {};
    _.extend(obj, options);

    return this.findByIdAndUpdateAsync(id, obj);
};

UserSchema.statics.delete = function (id) {
    return this.findByIdAndRemoveAsync(id);
};

UserSchema.statics.check = function (username, email) {
    return this.findAsync({ $or: [{username: username}, {email: email}]});
};

module.exports = mongoose.model('User', UserSchema);