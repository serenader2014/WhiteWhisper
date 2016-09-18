import { request as r } from 'http';
import config from '../config';

const env = process.NODE_ENV || 'development';

export default function request(options) {
    return new Promise((resolve, reject) => {
        const req = r({
            hostname: config[env].host,
            port: config[env].port,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            ...options,
        }, res => {
            let result = '';
            res.on('data', chunk => {
                result += chunk;
            });
            res.on('end', () => {
                result = JSON.parse(result);
                resolve(result);
            });
        });
        req.write(JSON.stringify(options.data));
        req.on('error', e => {
            reject(e);
        });
        req.end();
    });
}
