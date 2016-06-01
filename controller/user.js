import _              from 'lodash';
import userApi        from '../api/user';
import log            from '../helper/log';
import successCode    from '../../shared/constants/success-code';
import * as errorCode from '../../shared/constants/error-code';

const getInfo = (req, res) => {
    const { query } = req;
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
    getUser().then(data => {
        if (data.total) {
            targetUser = data.data[0];
            res.json(successCode('获取用户信息成功',
                _.pick(targetUser, ['_id', 'email', 'username', 'social'])));
        } else {
            res.json(errorCode.getError('用户'));
        }
    }).catch(err => {
        log.error(err);
        res.json({ code: 1, msg: err.message });
    });
};

export default { getInfo };
