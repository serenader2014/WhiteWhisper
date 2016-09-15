import createTable from './createTable';
import schemas from './schemas';
import logger from '../utils/logger';

const modelList = ['setting', 'post', 'user', 'category'];

export default () => modelList.reduce((promise, model) => promise.then(() => {
    /* eslint-disable global-require */
    const Model = require(`../model/${model}`).default;
    return Model.forge().fetchAll().catch(() => {
        logger.info(`Create database table: ${model}`);
        return createTable(model, schemas[model]);
    });
}), Promise.resolve());
