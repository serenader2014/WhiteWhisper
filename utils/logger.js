/* eslint no-console: 0 */
import chalk from 'chalk';
const log = {
    info(...args) {
        const start = `Info    -->   ${args.join('\n')} \n`;
        console.log(chalk.gray(start));
    },
    error(err) {
        let message;
        let stack;
        if (typeof err === 'object') {
            message = err.message;
            stack = err.stack;
        } else {
            message = err;
            stack = err;
        }
        const start = `Error   -->  \n  ${message} \n`;
        console.log(chalk.bold.bgWhite.red(start));
        console.log(chalk.bold.bgWhite.red(stack));
    },
    success(...args) {
        const start = `Success -->  \n ${args.join('\n')} \n`;
        console.log(chalk.green(start));
    },
};
export default log;
