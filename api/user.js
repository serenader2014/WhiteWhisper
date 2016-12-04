import User from '../model/user';
import bcrypt from 'bcrypt-nodejs';
import _ from 'lodash';
import Slug from '../utils/slug';
import Pagination from '../db/pagination';
import getResponseMsg from '../utils/get-response-msg';

const crypt = Promise.promisifyAll(bcrypt);
const userPagination = new Pagination(User);

export const model = User;

export async function generatePassword(password) {
    const salt = await crypt.genSaltAsync(8);
    return crypt.hashAsync(password, salt, null);
}

export function byId(id) {
    return User.query({ id });
}

export function byUsername(username) {
    return User.query({ username });
}

export function byEmail(email) {
    return User.query({ email });
}

export function bySlug(slug) {
    return User.query({ slug });
}

export function list(...args) {
    return userPagination.list(...args);
}

export async function create(options) {
    const defaultOption = {
        status: 'active',
        language: 'zh',
        created_at: new Date(),
        created_by: 0,
    };
    const user = _.extend({}, defaultOption, options);
    user.password = await generatePassword(user.password);
    user.username = user.username || user.email;
    user.slug = await new Slug('user', false).digest(user.username);

    return User.create(user);
}

export async function update(user, newUser, currentUser) {
    const finalObject = _.pick(newUser, [
        'username',
        'password',
        'email',
        'image',
        'cover',
        'bio',
        'website',
        'location',
        'social_value',
        'social_key',
        'status',
        'language',
        'tour',
        'last_login',
    ]);

    if (finalObject.username) {
        const ifExist = await byUsername(finalObject.username);
        if (ifExist) {
            return Promise.reject(getResponseMsg().error.user.usernameUsed({
                username: finalObject.username,
            }));
        }
        finalObject.slug = await new Slug('user', false).digest(finalObject.username);
    }

    if (finalObject.password) {
        finalObject.password = await generatePassword(finalObject.password);
    }

    finalObject.updated_at = new Date();
    finalObject.updated_by = currentUser.id;

    for (const i of Object.keys(finalObject)) {
        user.set(i, finalObject[i]);
    }

    return user.save();
}

export const checkIfExist = User.checkIfExist.bind(User);
