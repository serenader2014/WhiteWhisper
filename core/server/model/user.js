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

import Promise  from 'bluebird';
import mongoose from 'mongoose';
const mongo      = Promise.promisifyAll(mongoose);
const Schema     = mongo.Schema;
const ObjectId   = Schema.Types.ObjectId;
const UserSchema = new Schema({
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

export default mongo.model('User', UserSchema);