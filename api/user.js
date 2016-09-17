import User from '../model/user';
import bcrypt from 'bcrypt-nodejs';
import _ from 'lodash';
import generateSlug from '../utils/generate-slug';
import result from '../utils/result';

const crypt = Promise.promisifyAll(bcrypt);

export default {
    model: User,
    create: async function create(options) {
        const defaultOption = {
            status: 'active',
            language: 'en_US',
            created_at: new Date(),
            created_by: 0,
        };
        const user = _.extend({}, defaultOption, options);
        user.password = this.generatePassword(user.password);
        user.username = user.username || user.email;
        user.slug = await generateSlug(user.username, 'user', false);

        return User.create.bind(User)(user);
    },
    update: async function update(user, newUser, currentUser) {
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
            const ifExist = await this.byUsername(finalObject.username);
            if (ifExist) {
                return Promise.reject(result.user.usernameTaken({
                    username: finalObject.username,
                }));
            }
            finalObject.slug = await generateSlug(finalObject.username, 'user', false);
        }

        if (finalObject.password) {
            finalObject.password = this.generatePassword(finalObject.password);
        }

        finalObject.updated_at = new Date();
        finalObject.updated_by = currentUser.id;

        for (const i of Object.keys(finalObject)) {
            user.set(i, finalObject[i]);
        }

        return user.save();
    },
    byEmail(email) {
        return User.query({ email });
    },
    byId(id) {
        return User.query({ id });
    },
    byUsername(username) {
        return User.query({ username });
    },
    bySlug(slug) {
        return User.query({ slug });
    },
    checkIfExist: User.checkIfExist.bind(User),
    generatePassword(password) {
        return crypt.hashSync(password, crypt.genSaltSync(8), null);
    },
};
