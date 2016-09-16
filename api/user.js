import User from '../model/user';
import bcrypt from 'bcrypt-nodejs';
import _ from 'lodash';

const crypt = Promise.promisifyAll(bcrypt);

export default {
    model: User,
    create(options) {
        const defaultOption = {
            status: 'active',
            language: 'en_US',
            created_at: new Date(),
            created_by: 0,
        };
        const user = _.extend({}, defaultOption, options);
        user.password = this.generatePassword(user.password);
        user.username = user.username || user.email;
        user.slug = user.slug || user.username || user.email;

        return User.create.bind(User)(user);
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
