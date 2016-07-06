import expressValidator from 'express-validator';
import _ from 'lodash';

export default function validator() {
    return expressValidator({
        customValidators: {
            isEqual: function isEqual(param1, param2) {
                return _.isEqual(param1, param2);
            },
            isPassword: function isPassword(str) {
                return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(str);
            },
        },
    });
}
