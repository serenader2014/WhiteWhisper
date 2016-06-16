import path from 'path';
import Setting from '../model/setting';
import createTable from './createTable';
import schemas from './schemas';

import logger from '../utils/logger';

const fileSystem = Promise.promisifyAll(fs);
const {
    db: {
        connection: {
            filename,
        },
    },
} = config[process.NODE_ENV || 'development'];

const modelList = ['setting', 'post'];

export default () => modelList.reduce((promise, model) => {
    return promise.then(() => {
        const Model = require('../model/' + model).default;
        return Model.forge().fetchAll().catch((e) => {
            logger.info(`Create database table: ${model}`);
            return createTable(model, schemas[model])
        });
    });
}, Promise.resolve());
