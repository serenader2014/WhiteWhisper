import bookshelf from 'bookshelf';
import knex from './connection';

export default bookshelf(knex);
