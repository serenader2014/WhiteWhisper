import _       from 'lodash';
import userApi from '../api/user';
import log     from '../helper/log';

const getInfo = (req, res) => {
    let query = req.query;
    let targetUser = {};
    let getUser = () => {
        if (query.id) {
            return userApi.get({_id: query.id});
        } else if (query.email) {
            return userApi.get({email: query.email});
        } else if (query.username) {
            return userApi.get({username: query.username});
        } else {
            return Promise.resolve({
                total: req.user ? 1 : 0,
                data: [req.user],
                page: 1,
                amount: 10
            });
        }
    };
    getUser().then((data) => {
        if (data.total) {
            targetUser = data.data[0];
            res.json({code: 0, data: _.pick(targetUser, ['_id', 'email', 'username', 'social'])});
        } else {
            res.json({code: -5, data: null, msg: '找不到用户'});
        }
    }).catch((err) => {
        log.error(err);
        res.json({code: 1, msg: err.message});
    });
};

export default {getInfo};