require('babel-core/register');
require('../utils/startup-check').default().then(require('../index.js').default);
