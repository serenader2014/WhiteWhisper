import _ from 'lodash';
import User from '../model/user';

export default {
    model: User,
    create(options) {
        const user = {
            ...options,
            email: options.email,
            username: options.username || options.email,
            slug: options.slug || options.username || options.email,
            password: User.generatePassword.bind(User)(options.password),
            status: options.status || 'active',
            language: options.language || 'en_US',
            created_at: options.created_at || new Date(),
            created_by: options.created_by || 0,
        };

        return User.create.bind(User)(user);
    },
    byEmail: User.byEmail.bind(User),
    checkIfExist: User.checkIfExist.bind(User),
};
