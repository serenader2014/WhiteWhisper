import config from '../config.js';
import request from '../utils/request';

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

export async function registerUser() {
    const targetUser = generateUserInfo();
    let result = await request({
        path: registerUrl,
        method: 'POST',
        data: targetUser,
    });
    result = JSON.parse(result);
    if (result.code !== 0) {
        return Promise.reject();
    }
    return { ...result.data, ...targetUser };
}

export async function generateNewUser() {
    const user = await registerUser();
    let result = await request({
        path: authUrl,
        method: 'POST',
        data: user,
    });
    result = JSON.parse(result);

    if (result.code !== 0) {
        return Promise.reject();
    }
    return { ...user, token: result.data.token };
}
