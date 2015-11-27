var pkg    = require('./package.json');
var config = {
    version      : pkg.version,
    db           : 'mongodb://127.0.0.1/whitewhisper',
    sessionSecret: 'love music',
    host         : '127.0.0.1',
    port         : 10010,
    appRoot      : __dirname,
    trustProxy   : true,
    defaultBlogConfig   : {
        blogName       : 'White Whisper',
        blogDescription: 'Another blog system',
        blogLogo       : 'logo.png',
        blogFavicon    : 'favicon.ico',
        register       : true,
        theme          : 'white',
        requestAmount  : 10,
        update         : new Date(),
        background     : ''
    },
    defaultCategory: {
        name: '默认分类',
        count: 0
    },
    defaultPermission: {
        name: 'admin',
        editable: false,
        post: {
            get: true,
            post: true,
            put: true,
            delete: true
        },
        category: {
            get: true,
            post: true,
            put: true,
            delete: true
        },
        gallery: {
            get: true,
            post: true,
            put: true,
            delete: true
        },
        attachment: {
            get: true,
            post: true,
            put: true,
            delete: true
        },
        user: {
            get: true,
            post: true,
            put: true,
            delete: true
        },
        setting: {
            get: true,
            post: true,
            put: true,
            delete: true
        }
    },
    guestPermission: {
        name: 'guest',
        editable: true,
        post: {
            get: true,
            post: false,
            put: false,
            delete: false
        },
        category: {
            get: true,
            post: false,
            put: false,
            delete: false
        },
        gallery: {
            get: true,
            post: false,
            put: false,
            delete: false
        },
        attachment: {
            get: true,
            post: false,
            put: false,
            delete: false
        },
        user: {
            get: true,
            post: false,
            put: false,
            delete: false
        },
        setting: {
            get: true,
            post: false,
            put: false,
            delete: false
        }
    },
    defaultUserPermission: 'admin'
};

module.exports = global.config = config;