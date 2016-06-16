import Promise from 'bluebird';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import validator from 'express-validator';

import log from './utils/logger';
import init from './utils/init';
import config from './config';

global.Promise = Promise;

export default init().then(() => {
    const app = express();
    const appConfig = config[process.NODE_ENV || 'development'];

    app.use(logger());
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(validator());

    return new Promise((resolve) => {
        app.listen(appConfig.port, appConfig.host, err => {
            if (err) {
                log.error(err);
                process.exit(1);
            }
            resolve();
        });
    });
});
