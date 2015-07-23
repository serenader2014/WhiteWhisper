var admin    = require('./admin');
var frontend = require('./frontend');
var api      = require('./api');

module.exports = function (app) {
    // app.use('/admin', admin());
    // app.use('/', frontend());
    app.use('/api', api);
};