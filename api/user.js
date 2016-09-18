import User, { Users } from '../model/user';
import bcrypt from 'bcrypt-nodejs';
import _ from 'lodash';
import generateSlug from '../utils/generate-slug';
import result from '../utils/result';

const crypt = Promise.promisifyAll(bcrypt);

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

export function list() {
    return Users.forge().fetch();
}

export async function create(options) {
    const defaultOption = {
        status: 'active',
        language: 'en_US',
        created_at: new Date(),
        created_by: 0,
    };
    const user = _.extend({}, defaultOption, options);
    user.password = await generatePassword(user.password);
    user.username = user.username || user.email;
    user.slug = await generateSlug(user.username, 'user', false);

    return User.create.bind(User)(user);
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
            return Promise.reject(result.user.usernameTaken({
                username: finalObject.username,
            }));
        }
        finalObject.slug = await generateSlug(finalObject.username, 'user', false);
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
