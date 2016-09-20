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
export const categoryUrl = '/api/categories';
export const userUrl = '/api/users';
export const postUrl = '/api/posts';


export async function registerUser() {
    const targetUser = generateUserInfo();
    const result = (await request({
        path: registerUrl,
        method: 'POST',
        data: targetUser,
    })).toJSON();
    if (result.code !== 0) {
        return Promise.reject();
    }
    return { ...result.data, ...targetUser };
}

export async function createUser() {
    const user = await registerUser();
    const result = (await request({
        path: authUrl,
        method: 'POST',
        data: user,
    })).toJSON();

    if (result.code !== 0) {
        return Promise.reject();
    }
    return { ...user, token: result.data.token };
}

export async function createCategory(token) {
    let realToken = token;
    const name = randomString(8);
    if (!realToken) {
        const user = await createUser();
        realToken = user.token;
    }
    const result = (await request({
        path: `${categoryUrl}?token=${realToken}`,
        method: 'POST',
        data: { name },
    })).toJSON();

    if (result.code !== 0) {
        return Promise.reject();
    }

    return result.data;
}
