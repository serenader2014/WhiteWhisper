import bookshelf from 'bookshelf';
import knex from './connection';
import getResourceStructure from './get-structure';

const blogBookshelf = bookshelf(knex);
blogBookshelf.plugin('pagination');
blogBookshelf.plugin(getResourceStructure);

export default blogBookshelf;
