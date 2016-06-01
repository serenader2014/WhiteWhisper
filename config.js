import pkg from './package.json';
const config = {
    version: pkg.version,
    env: 'development',
    secret: 'love music',
    appRoot: __dirname,
    trustProxy: true,
    development: {
        db: {
            type: 'sqlite3',
            filename: 'whitewhisperdev',
        },
        host: 'localhost',
        port: 10010,
    },
    test: {
        db: {
            type: 'sqlite3',
            filename: 'whitewhispertest',
        },
        host: 'localhost',
        port: 10011,
    },
    production: {
        db: {
            type: 'sqlite3',
            filename: 'whitewhisper',
        },
        host: 'localhost',
        port: 10012,
    },
};
global.config = config;
export default config;
