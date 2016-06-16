import knex from 'knex';
const dbConfig = config[process.NODE_ENV || 'development'];

export default knex(dbConfig.db);
