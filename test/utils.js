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

export function generateUser() {
    return {
        email: `${randomString(5)}@domain.com`,
        password: generatePassword(16),
    };
}
