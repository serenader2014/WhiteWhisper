/* eslint-disable no-console */
import webpack          from 'webpack';
import getWebpackConfig from '../webpack.config.js';

process.env.NODE_ENV = 'production';
const bundler        = webpack(getWebpackConfig(process.env.NODE_ENV));

/* eslint-disable consistent-return */
bundler.run((err, stats) => {
    if (err) {
        console.log(err);
        return 1;
    }

    const jsonStats = stats.toJson();

    if (jsonStats.hasErrors) {
        return jsonStats.errors.map(error => console.log(error));
    }

    if (jsonStats.hasWarnings) {
        console.log('Webpack generated the following warnings: ');
        jsonStats.warnings.map(warning => console.log(warning));
    }

    console.log(`Webpack stats: ${stats}`);

    console.log('Your app has been compiled in production mode and written to /core/client/build.');
});
