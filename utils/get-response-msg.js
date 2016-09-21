import responseMsg from '../constant/response-msg';

export default function (lang) {
/* eslint-disable no-param-reassign */
    const targetLanguage = lang || 'zh';
    const msg = global.locale(targetLanguage);

    function sendJSON(data, message, status) {
        return {
            code: 0,
            status,
            msg: message,
            data,
        };
    }

    Object.keys(responseMsg).forEach(first => {
        sendJSON[first] = {};
        Object.keys(responseMsg[first]).forEach(second => {
            sendJSON[first][second] = {};
            Object.keys(responseMsg[first][second]).forEach(third => {
                const msgData = responseMsg[first][second][third];
                sendJSON[first][second][third] = function jsonData(extraData) {
                    return {
                        code: msgData.code,
                        status: msgData.status,
                        msg: msg[first][second][third],
                        data: extraData,
                    };
                };
            });
        });
    });

    return sendJSON;
}
