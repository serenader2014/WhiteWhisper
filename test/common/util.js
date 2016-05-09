export const param = obj => Object.keys(obj).map(item => `${item}=${obj[item]}`).join('&');
