import pkg from './package.json';
const config = {
    version: pkg.version,
    secret: 'love music',
    appRoot: __dirname,
    trustProxy: true,
    env: process.NODE_ENV || 'development',
    development: {
        db: {
            connection: {
                filename: './content/db/dev.sqlite',
            },
            client: 'sqlite3',
        },
        host: 'localhost',
        port: 10010,
        protocol: 'http://',
    },
    test: {
        db: {
            client: 'sqlite3',
            connection: {
                filename: './content/db/test.sqlite',
            },
        },
        host: 'localhost',
        port: 10011,
        protocol: 'http://',
    },
    production: {
        db: {
            client: 'sqlite3',
            connection: {
                filename: './content/db/prod.sqlite',
            },
        },
        host: 'localhost',
        port: 10012,
        protocol: 'http://',
    },
    get url() {
        const conf = this[this.env];

        return `${conf.protocol}${conf.host}:${conf.port}`;
    },
};
global.config = config;
export default config;
