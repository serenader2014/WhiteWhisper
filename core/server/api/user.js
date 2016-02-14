import  bcrypt    from 'bcrypt-nodejs';
import  _         from 'lodash';
import  User      from '../model/user';
import  get       from '../helper/get-data';

export default  {
    get () {
        return get.apply(User, arguments);
    },
    create (options) {
        var user = new User();
        _.extend(user, options);

        return user.saveAsync().spread((user) => {
            return user;
        });
    },
    update (id, options) {
        var obj = {};
        _.extend(obj, options);

        return User.findByIdAndUpdateAsync(id, obj);
    },
    delete (id) {
        return User.findByIdAndRemoveAsync(id);
    },
    check (username, email) {
        return User.findAsync({ $or: [{username: username}, {email: email}]});
    },
    getById (id) {
        return this.get({_id: id}, 1, 1);
    },
    getByEmail (email) {
        return this.get({email: email}, 1, 1);
    },
    getByUsername (username) {
        return this.get({username: username});
    },
    getAll (amount, page) {
        return this.get({}, amount, page);
    },
    login (email, ip) {
        return this.get({email: email}, 1, 1).then((data) => {
            var user = data.data[0];
            user.log.push({
                date: new Date(),
                type: 2,
                user: user.email,
                data: ip
            });
            return user.saveAsync();
        });
    },
    generatePassword (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    validatePassword (pwd1, pwd2) {
        return bcrypt.compareSync(pwd1, pwd2);
    }
};