import pkg from './package.json';
const config = {
    version: pkg.version,
    env: 'development',
    secret: 'love music',
    appRoot: __dirname,
    trustProxy: true,
    development: {
        db: {
            client: 'sqlite3',
            filename: './content/db/dev.sqlite',
        },
        host: 'localhost',
        port: 10010,
    },
    test: {
        db: {
            client: 'sqlite3',
            filename: './content/db/test.sqlite',
        },
        host: 'localhost',
        port: 10011,
    },
    production: {
        db: {
            client: 'sqlite3',
            filename: './content/db/prod.sqlite',
        },
        host: 'localhost',
        port: 10012,
    },
};
global.config = config;
export default config;
