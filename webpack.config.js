import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-plugin';
import path from 'path';
import browserSync from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const devEnv = 'development';
const prodEnv = 'production';
const env = process.env.NODE_ENV || devEnv;

function getEntry (env) {
    const entry = [];

    if (env === devEnv) {
        entry.push('webpack-hot-middleware/client');
    }

    entry.push('./core/client/src/index');
}

function getPlugins (env) {
    const GLOBALS = {
        'process.env.NODE_ENV': JSON.stringify(env),
        __DEV__: env === devEnv
    };

    const plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin(GLOBALS)
    ];

    switch (env) {
        case devEnv:
            plugins.push(new webpack.HotModulesReplacementPlugin());
            plugins.push(new webpack.NoErrorsPlugin());
            break;
        case prodEnv:
            plugins.push(new ExtractTextPlugin('styles.css'));
            plugins.push(new webpack.optimize.DedupePlugin());
            plugins.push(new webpack.optimize.UglifyJsPlugin());
            break;
    }

    return plugins;
}

function getLoaders (env) {
    const loaders = [{ 
        test: /\.js$/, 
        include: path.join(__dirname, 'core/client/src'),
        loaders: ['babel', 'eslint']
    }];

    if (env == prodEnv) {
        loaders.push({
            test: /(\.css|\.scss)$/,
            loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap')
        });
    } else {
        loaders.push({
            test: /(\.css|\.scss)$/,
            loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
        });
    }

    return loaders;
}

const config =  {
    debug: true,
    devtool: env === prodEnv ? 'source-map' : 'cheap-module-eval-source-map',
    noInfo: true,
    entry: getEntry(env),
    output: {
        path: path.resolve(__dirname, 'core/client/build'),
        publicPath: '',
        filename: 'bundle.js'
    },
    plugins: getPlugins(env),
    module: {
        loaders: getLoaders(env)
    }
};

const bundler = webpack(config);

browserSync({
    server: {
        baseDir: path.resovle(__dirname, 'core/client/src'),
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
    ]
});