import bookshelf from '../db/bookshelf';

const Setting = bookshelf.Model.extend({
    tableName: 'setting',
});

export default Setting;
