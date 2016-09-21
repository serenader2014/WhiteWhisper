export default {
    error: {
        // 0
        common: {
            serverError: {
                code: '00001',
                status: 500,
            },
            formInvalid: {
                code: '00002',
                status: 400,
            },
            forbidden: {
                code: '00003',
                status: 403,
            },
            unauthorized: {
                code: '00004',
                status: 401,
            },
        },

        // 1
        user: {
            passwordIncorrect: {
                code: '10001',
            },
            notFound: {
                code: '10002',
            },
            passwordLength: {
                code: '10003',
            },
            usernameLength: {
                code: '10004',
            },
            alreadyLogin: {
                code: '10005',
            },
            passwordFormat: {
                code: '10006',
            },
            usernameFormat: {
                code: '10007',
            },
            usernameUsed: {
                code: '10008',
            },
            emailUsed: {
                code: '10009',
            },
        },

        // 2
        post: {
            slugUsed: {
                code: '20001',
            },
        },

        // 3
        category: {
            nameUsed: {
                code: '30001',
            },
            notFound: {
                code: '30002',
            },
        },
    },
};
