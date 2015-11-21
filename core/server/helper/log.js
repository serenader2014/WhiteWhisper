var chalk = require('chalk');
var log   = {};

log.info = function (message) {
    var start = 'Info    -->  ' + message + '\n';
    console.log(chalk.gray(start));
};
log.error = function (message, stack) {
    var start = 'Error   -->  \n' + message + '\n';
    console.log(chalk.bold.bgWhite.red(start));
    console.log(chalk.bold.bgWhite.red(stack));
};
log.success = function (message) {
    var start = 'Success -->  \n' + message + '\n';
    console.log(chalk.green(start));
};

module.exports = log;