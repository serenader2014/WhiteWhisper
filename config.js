var pkg    = require('./package.json');
var config = {
    version      : pkg.version,
    db           : 'mongodb://127.0.0.1/whitewhisper',
    sessionSecret: 'love music',
    host         : '127.0.0.1',
    port         : 10010,
    appRoot      : __dirname,
    trustProxy   : true,
    blogConfig   : {
        blogName       : 'White Whisper',
        blogDescription: 'Another blog system',
        blogLogo       : 'logo.png',
        blogFavicon    : 'favicon.ico',
        register       : true,
        theme          : 'white',
        requestAmount  : 10,
        update         : new Date(),
        background     : ''
    }
};

module.exports = global.config = config;