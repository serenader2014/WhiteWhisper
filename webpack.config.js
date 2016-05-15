import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { resolve } from 'path';

const devEnv = 'development';
const prodEnv = 'production';

function getEntry(env) {
    const entry = [];

    if (env === devEnv) {
        entry.push('webpack-hot-middleware/client');
    }

    entry.push('./client/app/index.js');
    return entry;
}

function getPlugins(env) {
    const GLOBALS = {
        'process.env.NODE_ENV': JSON.stringify(env),
        __DEV__               : env === devEnv,
    };

    const plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin(GLOBALS),
    ];

    switch (env) {
        case devEnv:
            plugins.push(new webpack.HotModuleReplacementPlugin());
            plugins.push(new webpack.NoErrorsPlugin());
            break;
        case prodEnv:
            plugins.push(new ExtractTextPlugin('styles.css'));
            plugins.push(new webpack.optimize.DedupePlugin());
            plugins.push(new webpack.optimize.UglifyJsPlugin());
            break;
        default:
            return plugins;
    }
    return plugins;
}

function getLoaders(env) {
    const loaders = [{
        test   : /\.jsx?$/,
        include: resolve(__dirname, '/client'),
        loaders: ['babel-loader', 'eslint-loader'],
    }];

    if (env === prodEnv) {
        loaders.push({
            test  : /(\.css|\.scss)$/,
            loader: ExtractTextPlugin.extract('css-loader?sourceMap!sass-loader?sourceMap'),
        });
    } else {
        loaders.push({
            test   : /(\.css|\.scss)$/,
            loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
        });
    }

    return loaders;
}

export default function getWebpackConfig(env) {
    return {
        debug  : true,
        devtool: env === prodEnv ? 'source-map' : 'cheap-module-eval-source-map',
        noInfo : true,
        entry  : getEntry(env),
        output : {
            path      : resolve(__dirname, 'client/'),
            publicPath: '',
            filename  : 'bundle.js',
        },
        plugins: getPlugins(env),
        module : {
            loaders: getLoaders(env),
        },
    };
}
