import { getPreSalesApi } from './api';
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';

import { preSales } from './constants';

function* getPresalesFunction({ payload }) {
    try {
        yield put({
            type: preSales.GET_ALL_PRESALES_LOADING,
            payload: {},
        });
        const response = yield call(getPreSalesApi, { payload });
        if (response.data.status) {
            yield put({
                type: preSales.GET_ALL_PRESALES_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: preSales.GET_ALL_PRESALES_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: preSales.GET_ALL_PRESALES_ERROR,
                payload: { ...response.data },
            });
        }
    } catch (error) {
        yield put({
            type: preSales.GET_ALL_PRESALES_ERROR,
            payload: { message: error?.message },
        });
    }
}

export function* getPreSaleSaga(): any {
    yield takeEvery(preSales.GET_ALL_PRESALES, getPresalesFunction);
}
