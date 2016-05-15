import Promise from 'bluebird';
import mongoose from 'mongoose';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import validator from 'express-validator';

import log from '../utils/logger';
import init from '../utils/init';
import config from '../config';

global.Promise = Promise;

export default init.then(() => {
    const app = express();

    app.use(logger());
    app.use(cookieParser());
    app.use(bodyParser());

    return new Promise((resolve) => {
        app.listen(config.port, err => {
            if (err) {
                log.error(err);
                process.exit(1);
            }
            resolve();
        });
    });
});
