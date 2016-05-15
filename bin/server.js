require('babel-core/register');
require('../utils/startup-check').default().then(require('../server').default);
