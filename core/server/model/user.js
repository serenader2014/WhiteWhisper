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
var Schema     = mongoose.Schema;
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

module.exports = mongoose.model('User', UserSchema);