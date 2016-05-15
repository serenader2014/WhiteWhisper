import pkg from './package.json';
const config = {
    version: pkg.version,
    env: 'development',
    secret: 'love music',
    appRoot: __dirname,
    trustProxy: true,
    development: {
        db: {
            host: 'localhost',
            user: '',
            password: '',
            database: 'whitewhisperdev',
            port: 27017,
        },
        host: 'localhost',
        port: 10010,
    },
    test: {
        db: {
            host: 'localhost',
            user: '',
            password: '',
            database: 'whitewhispertest',
            port: 27017,
        },
        host: 'localhost',
        port: 10011,
    },
    production: {
        db: {
            host: 'localhost',
            user: '',
            password: '',
            database: 'whitewhisper',
            port: 27017,
        },
        host: 'localhost',
        port: 10012,
    },
};
global.config = config;
export default config;
