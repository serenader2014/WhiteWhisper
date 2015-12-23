import chalk from 'chalk';
let log  = {
    info (message) {
        var start = `Info    -->   ${message} \n`;
        console.log(chalk.gray(start));
    },
    error (err) {
        var message, stack;
        if (typeof err === 'object') {
            message = err.message;
            stack = err.stack;
        } else {
            message = err;
            stack = err;
        }
        var start = `Error   -->  \n  ${message} \n`;
        console.log(chalk.bold.bgWhite.red(start));
        console.log(chalk.bold.bgWhite.red(stack));
    },
    success (message)  {
        var start = `Success -->  \n ${message} \n`;
        console.log(chalk.green(start));
    }
};
export default log;