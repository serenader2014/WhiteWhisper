import { LOGIN } from '../shared/constants';

const initialState = {
    email   : null,
    password: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return state;

        default:
            return state;
    }
};
