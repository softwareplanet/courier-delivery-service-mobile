import * as types from './actionTypes'

export const sendRequest = store => next => action => {
    if (!(action.type === types.SEND_REQUEST)) return next(action);
    let {requests} = store.getState();

};
