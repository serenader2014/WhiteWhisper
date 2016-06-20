import bookshelf from '../db/bookshelf';

const User = bookshelf.Model.extend({
    tableName: 'user',
});

export default User;
