import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { offline } from '@redux-offline/redux-offline';
import { applyMiddleware, createStore, compose } from 'redux';
import reducer from './reducerOffline';
import * as middleware from './middlewares';
export const store = createStore(
    reducer,
    compose(
            applyMiddleware(...middleware),
            offline(offlineConfig)
    )
);
