var Promise      = require('bluebird');
var mongoose     = Promise.promisifyAll(require('mongoose'));
var express      = require('express');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var validator    = require('express-validator');
var MongoStore   = require('connect-mongo')(session);
var passport     = require('passport');

// 将 bluebird 的Promise 暴露于全局变量中，方便于其他文件模块中引用。
global.Promise   = Promise;

var app          = express();
var config       = require('./config');
var log          = require('./core/server/helper/log');
var route        = require('./core/server/route');
var brute        = require('./core/server/middleware/brute');
var assets       = require('./core/server/middleware/assets');
var notFound     = require('./core/server/middleware/404');
var setCookie    = require('./core/server/middleware/set-cookie');
var responseTime = require('./core/server/middleware/response-time');


mongoose.connectAsync(config.db).then(function () {
    // 设置模板引擎为 jade
    app.set('view engine', 'jade');
    app.set('port', config.port);
    // trust proxy 用于获取真实ip。当服务器由前端服务器如Nginx转发到nodejs程序时，则需要
    // 设置该选项，才能获取正确的客户端地址，否则一直为 127.0.0.1
    if (config.trustProxy) {
        app.set('trust proxy', true);
    }

    global.env        = app.get('env');
    // 将设置挂载到 locals 中，方便模板文件中读取。
    app.locals.config = config;

    // 每秒钟至多请求1000次，超过则需等待5分钟或以上。
    app.use(brute({
        limitCount: 1000,
        limitTime: 1000,
        minWaitTime: 5*1000,
    }));

    app.use(bodyParser.json());
    app.use(validator());
    app.use(cookieParser());

    if (global.env === 'production') {
        app.use(logger('combined'));
    } else {
        app.use(logger('dev'));
    }

    app.use(session({
        name: 'blog session',
        secret: config.sessionSecret,
        store: new MongoStore({
            url: config.db
        }),
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    require('./core/server/helper/passport')(passport);

    app.use(responseTime());
    app.use(setCookie());

    app.use(assets());
    route(app);
    app.use(notFound());

    app.listen(app.get('port'), config.host, function () {
        log.info('Server now listen on ' + config.host + ':' + app.get('port'));
        log.info('Server is running on ' + app.get('env') + ' envriroment.');
    });

}).catch(function (err) {
    log.error(err.message, err.stack);
    process.exit(1);
});