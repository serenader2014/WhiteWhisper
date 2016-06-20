import bookshelf from '../db/bookshelf';
import bcrypt from 'bcrypt-nodejs';
import result from '../utils/result';

const User = bookshelf.Model.extend({
    tableName: 'user',
}, {
    generatePassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    validatePassword(pwd1, pwd2) {
        return bcrypt.compareSync(pwd1, pwd2);
    },
    checkIfExist(obj) {
        return this.forge()
            .query(queryBuilder => {
                queryBuilder
                    .where('email', obj.email)
                    .orWhere('username', obj.username);
            })
            .fetch();
    },
    byEmail(email) {
        return this.forge()
            .query('where', 'email', '=', email)
            .fetch();
    },
    create(user) {
        return this.forge(user)
            .save();
    }
});

export default User;
