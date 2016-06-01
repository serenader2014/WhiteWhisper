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

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const userObj = {
    username: String,
    id: ObjectId,
    image: String,
};
const UserSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    permission: {
        profileName: String,
        id: ObjectId,
    },
    image: String,
    cover: String,
    bio: String,
    social: Array,
    location: String,
    status: String,
    log: Array,
    slug: { type: String, unique: true },
    createdAt: Date,
    createdBy: userObj,
    updatedAt: Date,
    updatedBy: userObj,
});

export default mongoose.model('User', UserSchema);
