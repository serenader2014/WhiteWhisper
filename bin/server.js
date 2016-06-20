global.Promise = require('bluebird');
global.fs = Promise.promisifyAll(require('fs'));
require('babel-core/register');
require('../utils/startup-check').default();
require('../index.js').default();
