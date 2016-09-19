import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import notFound from './middleware/404';
import setExtraHaders from './middleware/set-extra-headers';
import requestValidator from './middleware/req-validator';

import route from './route';

import log from './utils/logger';
import init from './utils/init';
import config from './config';

export default async () => {
    await init();
    const app = Promise.promisifyAll(express());
    const env = config.env;
    const appConfig = config[env];

    if (env !== 'test') {
        app.use(logger(env === 'development' ? 'dev' : 'combined'));
    }
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(requestValidator());

    app.use(setExtraHaders());
    app.use(route());
    app.use(notFound());

    try {
        await app.listenAsync(appConfig.port, appConfig.host);
        log.info(`App is running on ${env} mode`);
        log.info(`App is listening on ${appConfig.host}:${appConfig.port}`);
    } catch (e) {
        log.error(e);
        process.exit(1);
    }

    return app;
};
