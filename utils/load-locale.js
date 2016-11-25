import path from 'path';
import _ from 'lodash';

export default async function () {
    /* eslint-disable global-require */
    const dir = path.resolve(__dirname, '../', 'constant/locale');
    const defaultLang = require(path.resolve(dir, 'zh.js')).default.msg;
    const fileList = await fs.readdirAsync(dir);
    const locale = {};
    fileList.forEach(async file => {
        const stat = await fs.statAsync(path.resolve(dir, file));
        if (stat.isFile()) {
            const data = require(path.resolve(dir, file));
            locale[data.language] = data.msg;
        }
    });

    global.locale = (lang) => _.extend({}, defaultLang, locale[lang]);
}
