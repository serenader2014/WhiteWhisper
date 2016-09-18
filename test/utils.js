import config from '../config.js';
import { request } from 'http';

export function randomString(length) {
    if (length < 1) return '';
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    return `${str[Math.round(Math.random() * length)]}${randomString(length - 1)}`;
}

export function generatePassword(length) {
    const type = [
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789',
        '$@$!%*#?&',
    ];
    function randomKey(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    return type.reduce((arr, item) => arr.concat(randomKey(item)), [])
        .concat(
            new Array(length - type.length)
            .fill('')
            .map(() => randomKey(type[Math.floor(Math.random() * type.length)]))
        )
        .sort(() => Math.random() > 0.5).join('');
}

export function generateUserInfo() {
    return {
        email: `${randomString(8)}@domain.com`,
        password: generatePassword(16),
    };
}

export const appUrl = `${config.test.host}:${config.test.port}`;
export const authUrl = '/api/auth';
export const registerUrl = '/api/register';

export function registerUser() {
    const targetUser = generateUserInfo();
    return new Promise((resolve, reject) => {
        const registerRequest = request({
            hostname: config.test.host,
            port: config.test.port,
            path: registerUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }, res => {
            let result = '';
            res.on('data', chunk => {
                result += chunk;
            });
            res.on('end', () => {
                result = JSON.parse(result);
                if (result.code === 0) {
                    resolve({ ...result.data, ...targetUser });
                }
            });
        });

        registerRequest.on('error', e => {
            reject(e);
        });
        registerRequest.write(JSON.stringify(targetUser));
        registerRequest.end();
    });
}

export async function generateNewUser() {
    const user = await registerUser();
    return new Promise((resolve, reject) => {
        const loginRequest = request({
            hostname: config.test.host,
            port: config.test.port,
            path: authUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }, res => {
            let result = '';
            res.on('data', chunk => {
                result += chunk;
            });
            res.on('end', () => {
                result = JSON.parse(result);
                if (result.code === 0) {
                    resolve({ ...user, token: result.data.token });
                }
            });
        });

        loginRequest.on('error', e => {
            reject(e);
        });

        loginRequest.write(JSON.stringify(user));
        loginRequest.end();
    });
}
