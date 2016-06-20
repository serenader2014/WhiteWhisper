import logger from './logger';

export default function (dir) {
    try {
        fs.statSync(dir);
    } catch (err) {
        if (err.code === 'ENOENT') {
            logger.info(`Create folder: ${dir}`);
            fs.mkdirSync(dir);
        }
    }
}
