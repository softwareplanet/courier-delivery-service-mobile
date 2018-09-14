import * as types from './actionTypes';

export default function reducer(state = {requests: []}, action) {
    switch (action.type) {
        case types.SEND_REQUEST: {
            state.requests.push(action.payload);
            return state;
        }
        case types.REQUEST_SUCCESS: {
            state.requests.shift();
            return state;
        }
        default:
            return state;
    }
}

