import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import ReportTypes from './constant';
import { getReportApi } from './api';

function* getReportFunction({ payload }) {
    try {
        yield put({
            type: ReportTypes.GET_REPORT_LOADING,
            payload: {}
        })
        const response = yield call(getReportApi, { payload });
        // console.log(payload, ".......")

        if (response.data.status) {
            yield put({
                type: ReportTypes.GET_REPORT_SUCCESS,
                payload: { ...response.data },
            });
        }
        else {
            yield put({
                type: ReportTypes.GET_REPORT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ReportTypes.GET_REPORT_ERROR,
            payload: { message: error?.message }
        });

    }
}

export function* getReportSaga(): any {
    yield takeEvery(ReportTypes.GET_REPORT, getReportFunction);
}

function* AllReportSaga(): any {
    yield all([
        fork(getReportSaga),
    ])
}

export default AllReportSaga;