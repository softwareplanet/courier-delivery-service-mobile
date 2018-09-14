import * as types from "./actionTypes";

export function sendRequest(body, url) {
    return {
        type: types.SEND_REQUEST,
        payload: {url, body}
    };
}

export function connection() {
    return {
        type: types.CONNECTION,
    };
}

export function requestSuccess(response) {
    return {
        type: types.REQUEST_SUCCESS,
        payload: response
    };
}

export function processRequest(response) {
    return {
        type: types.CONNECTION,
        payload: response
    };
}

