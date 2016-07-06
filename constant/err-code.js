// 0
export const common = {
    formInvalid: '00001',
    serverError: '01000',
    permissionDeny: '00002',
};

// 1
export const login = {
    passwordIncorrect: '10001',
    userNotExist: '10002',
    passwordLength: '10003',
    usernameLength: '10004',
    alreadyLogin: '10005',
};

// 2
export const register = {
    passwordLength: '20001',
    usernameLength: '20002',
    passwordFormat: '20003',
    usernameFormat: '20004',
    usernameTaken: '20005',
    emailTaken: '20006',
};

// 3
export const user = {
    userNotExist: '30001',
    usernameTaken: '30002',
    noPermission: '30003',
    passwordIncorrect: '30004',
};
