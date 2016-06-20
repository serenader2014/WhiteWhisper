import bookshelf from '../db/bookshelf';

const Category = bookshelf.Model.extend({
    tableName: 'category',
});
export default Category;
