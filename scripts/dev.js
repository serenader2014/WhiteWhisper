import browserSync          from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack              from 'webpack';
import { resolve }          from 'path';
import getWebpackConfig     from '../webpack.config.js';
import app                  from '../core/server';
import { request, Agent }   from 'http';


const webpackConfig = getWebpackConfig('development');
const bundler       = webpack(webpackConfig);
const agent         = new Agent({
    maxSockets: 100000,
});

const proxyApi = (req, res, next) => {
    const url = req.url;
    if (url.indexOf('/api') === -1) {
        next();
        return;
    }
    /*eslint no-console:false */
    console.log(`proxying api request: ${url}`);
    const proxy = request({
        path: url,
        host: config.host,
        port: config.port,
        headers: req.headers,
        method: req.method,
        agent,
    }, (response) => {
        response.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });

    proxy.on('error', (err) => {
        res.end(err.stack);
    });
};

app().then(() => {
    browserSync({
        server: {
            baseDir: resolve(__dirname, '../core/client/src'),
            middleware: [
                webpackDevMiddleware(bundler, {
                    publicPath: webpackConfig.output.publicPath,
                    stats: { color: true },
                    noInfo: true,
                }),
                webpackHotMiddleware(bundler),
                proxyApi,
            ],
        },
        files: [
            'core/client/src/*.html',
        ],
        port: 7777,
        ui: {
            port: 7776,
        },
    });
});
