import knex from 'knex';
import bookshelf from 'bookshelf';

const dbConfig = config[process.NODE_ENV || 'development'];

export default knex({
    client: dbConfig.client,
    connection: {
        filename: dbConfig.filename,
    }
});
