/* eslint-disable no-console, consistent-return */
import fs          from 'fs';
import { resolve } from 'path';
import rm          from 'rimraf';

const fileName  = 'index.html';
const srcPath   = resolve(__dirname, '../core/client/src');
const buildPath = resolve(__dirname, '../core/client/build');

rm(buildPath, (err) => {
    if (err) {
        return console.log('Remove build folder error.');
    }
    fs.readFile(resolve(srcPath, fileName), 'utf8', (err1, content) => {
        if (err1) {
            return console.log('Read index.html file error.');
        }
        fs.mkdir(buildPath, (err2) => {
            if (err2) {
                return console.log('Make build folder error.');
            }
            fs.writeFile(resolve(buildPath, fileName), content, 'utf8', (err3) => {
                if (err3) {
                    console.log('Write index.html file error.');
                }
                console.log(`index.html written to ${resolve(buildPath, fileName)}`);
            });
        });
    });
});
