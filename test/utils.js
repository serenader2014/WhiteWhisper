export function randomString(length) {
    if (length < 1) return '';
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    return `${str[Math.round(Math.random() * length)]}${randomString(length - 1)}`;
}

export function generateUser() {
    return {
        email: `${randomString(5)}@domain.com`,
        password: randomString(10),
    };
}
