import Promise      from 'bluebird';
import mongoose     from 'mongoose';
import express      from 'express';
import logger       from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser   from 'body-parser';
import session      from 'express-session';
import validator    from 'express-validator';
import mongoStore   from 'connect-mongo';
import passport     from 'passport';

import config       from '../../config';
import log          from './helper/log';
import initDB       from './helper/init-db';
import route        from './route';
// import brute        from './middleware/brute';
import assets       from './middleware/assets';
import notFound     from './middleware/404';
import setCookie    from './middleware/set-cookie';
import responseTime from './middleware/response-time';

export default function (env) {
    const app         = express();
    const MongoStore  = mongoStore(session);
    const mongo       = Promise.promisifyAll(mongoose);
    const envriroment = env || app.get('env');
    return mongo.connectAsync(envriroment === 'test' ? config.testDb : config.db)
    .then(initDB).then(() => {
        // 设置模板引擎为 jade
        app.set('view engine', 'jade');
        app.set('port', env === 'test' ? config.testPort : config.port);
        // trust proxy 用于获取真实ip。当服务器由前端服务器如Nginx转发到nodejs程序时，则需要
        // 设置该选项，才能获取正确的客户端地址，否则一直为 127.0.0.1
        if (config.trustProxy) {
            app.set('trust proxy', true);
        }

        global.env = app.get('env');
        // 将设置挂载到 locals 中，方便模板文件中读取。
        app.locals.config = config;

        // 每秒钟至多请求1000次，超过则需等待5分钟或以上。
        // app.use(brute({
        //     limitCount: 1000,
        //     limitTime: 1000,
        //     minWaitTime: 5*1000,
        // }));

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(validator({
            customValidators: {
                isPostStatus(value) {
                    return ['published', 'unpublished', 'deleted', 'draft'].indexOf(value) !== -1;
                },
            },
        }));
        app.use(cookieParser());

        if (global.env === 'production') {
            app.use(logger('combined'));
        } else {
            app.use(logger('dev'));
        }

        app.use(session({
            name  : 'blog session',
            secret: config.sessionSecret,
            store : new MongoStore({
                url: config.db,
            }),
            resave           : true,
            saveUninitialized: true,
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(responseTime());
        app.use(setCookie());

        app.use(assets());
        app.use(route());
        app.use(notFound());


        return new Promise(resolve => {
            app.listen(app.get('port'), config.host, () => {
                log.info(`Server now listen on ${config.host} : ${app.get('port')}`);
                log.info(`Server is running on ${app.get('env')} envriroment.`);
                resolve();
            });
        });
    }).catch((err) => {
        log.error(err.message, err.stack);
        process.exit(1);
        throw err;
    });
}
