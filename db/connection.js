import knex from 'knex';
import path from 'path';
import ensureFolderExist from '../utils/ensure-folder-exist';

const dbConfig = config[process.NODE_ENV || 'development'];
const dir = path.dirname(path.join(config.appRoot, dbConfig.db.connection.filename));
ensureFolderExist(dir);
export default knex(dbConfig.db);
