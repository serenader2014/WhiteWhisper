import browserSync          from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack              from 'webpack';
import { resolve }          from 'path';
import webpackConfig        from '../webpack.config.js';


let config = webpackConfig('development');
let bundler = webpack(config);

browserSync({
    server: {
        baseDir: resolve(__dirname, '../core/client/src'),
        middleware: [
            webpackDevMiddleware(bundler, {
                publicPath: config.output.publicPath,
                stats: { color: true },
                noInfo: true
            }),
            webpackHotMiddleware(bundler)
        ]
    },
    files: [
        'core/client/src/*.html'
    ],
    port: 7777,
    ui: {
        port: 7776
    }
});