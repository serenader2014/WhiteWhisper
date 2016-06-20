import  _         from 'lodash';
import  User      from '../model/user';
import  get       from '../helper/get-data';

export default {
    model: User,
    create(options) {
        const user = {
            ...options,
            email: options.email,
            username: options.username || this.email.split('@')[0],
            slug: options.slug || this.username,
            password: User.generatePassword(password),
            status: options.status || 'active',
            language: options.language || 'en_US',
            created_at: options.created_at || new Date(),
            created_by: options.created_by || 0,
        };

        return User.create(user);
    },
    byEmail: User.byEmail,
    checkIfExist: User.checkIfExist,
};
