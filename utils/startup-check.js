/* eslint-disable global-require, no-console */
import path from 'path';
import pkg from '../package.json';
import logger from './logger';
import config from '../config';

const exitsCode = {
    DEPENDENCIES_MISSING: 1,
    NO_ENV_CONFIG: 2,
    DB_CONNECT_FAIL: 3,
    CLOSE_DB_FAIL: 4,
};

function dependencyCheck() {
    let errors = [];
    Object.keys(pkg.dependencies).forEach(item => {
        try {
            require.resolve(item);
        } catch (e) {
            errors.push(e.message);
        }
    });

    if (!errors.length) {
        return;
    }

    errors = errors.join('\n');

    logger.error(`unable to start server due to missing dependencies: ${errors}`);
    process.exit(exitsCode.DEPENDENCIES_MISSING);
}

function envCheck() {
    const env = process.env.NODE_ENV || config.env;

    if (!config[env]) {
        console.error(`unable to find config for current env: ${env}`);
        process.exit(exitsCode.NO_ENV_CONFIG);
    }
}

function folderCheck() {
    const folderList = ['/content/db'];

    return folderList.reduce((promise, folder) => {
        const dir = path.join(config.appRoot, folder);
        return promise.then(() => fs.statAsync(dir))
            .catch(err => {
                if (err.code === 'ENOENT') {
                    logger.info(`Create folder: ${folder}`);
                    return fs.mkdirAsync(dir);
                }
            });
    }, Promise.resolve());
}

export default function startUpCheck() {
    dependencyCheck();
    envCheck();
    return folderCheck();
}
