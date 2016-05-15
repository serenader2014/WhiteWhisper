/* eslint-disable global-require, no-console */
import pkg from '../package.json';
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

    console.error(`unable to start server due to missing dependencies: ${errors}`);
    process.exit(exitsCode.DEPENDENCIES_MISSING);
}

function mongodbCheck() {
    const mongoose = require('mongoose');
    const env = process.env.NODE_ENV || config.env;
    const {
        user,
        password,
        host,
        port,
        database,
    } = config[env].db;
    const auth = user && password ? `${user}:${password}@` : '';
    const dbUrl = `mongodb://${auth}${host}:${port}/${database}`;

    return mongoose.connect(dbUrl, err => {
        if (err) {
            console.error(`connect to mongoDB failed: ${err.message}`);
            process.exit(exitsCode.DB_CONNECT_FAIL);
        }
    });
}

function envCheck() {
    const env = process.env.NODE_ENV || config.env;

    if (!config[env]) {
        console.error(`unable to find config for current env: ${env}`);
        process.exit(exitsCode.NO_ENV_CONFIG);
    }
}

export default function startUpCheck() {
    dependencyCheck();
    envCheck();
    return mongodbCheck();
}
