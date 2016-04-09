import _       from 'lodash';
import userApi from '../api/user';
import log     from '../helper/log';

const getInfo = (req, res) => {
    const query = req.query;
    const getUser = () => {
        if (query.id) {
            return userApi.get({ _id: query.id });
        } else if (query.email) {
            return userApi.get({ email: query.email });
        } else if (query.username) {
            return userApi.get({ username: query.username });
        }
        return Promise.resolve({
            total : req.user ? 1 : 0,
            data  : [req.user],
            page  : 1,
            amount: 10,
        });
    };
    let targetUser = {};
    getUser().then((data) => {
        if (data.total) {
            targetUser = data.data[0];
            res.json({ code: 0, data: _.pick(targetUser, ['_id', 'email', 'username', 'social']) });
        } else {
            res.json({ code: -5, data: null, msg: '找不到用户' });
        }
    }).catch((err) => {
        log.error(err);
        res.json({ code: 1, msg: err.message });
    });
};

export default { getInfo };
