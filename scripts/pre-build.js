/*eslint-disable no-console*/

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
    fs.readFile(resolve(srcPath, fileName), 'utf8', (err, content) => {
        if (err) {
            return console.log('Read index.html file error.');
        }
        fs.mkdir(buildPath, (err) => {
            if (err) {
                return console.log('Make build folder error.');
            }
            fs.writeFile(resolve(buildPath, fileName), content, 'utf8', (err) => {
                if (err) {
                    console.log('Write index.html file error.');
                }
                console.log(`index.html written to ${resolve(buildPath, fileName)}`);
            });
        });
    });
});
