import * as errorCode from '../constant/err-code';
import message from '../constant/msg-zh';

function result(data, msg) {
    return {
        code: 0,
        msg,
        data,
    }
}

Object.keys(errorCode).forEach(type => {
    result[type] = {};
    Object.keys(errorCode[type]).forEach(item => {
        result[type][item] = function (data) {
            return {
                code: errorCode[type][item],
                msg: message[errorCode[type][item]],
                data,
            };
        };
    });
});

export default result;
