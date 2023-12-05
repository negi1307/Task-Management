import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import TIME_TRACKER_TYPES from './constant';
import { getTimeTrackerApi} from './api';

function* getTimeTrackerFunction() {
    try {
        yield put({
            type: TIME_TRACKER_TYPES.GET_TIME_TRACKER_LOADING,
            payload: {}
        })
        const response = yield call(getTimeTrackerApi);
        console.log(response,'resss')
        if (response.data.status) {
            yield put({
                type: TIME_TRACKER_TYPES.GET_TIME_TRACKER_SUCCESS,
                payload:  response ,
            });
        }
        else {
            yield put({
                type: TIME_TRACKER_TYPES.GET_TIME_TRACKER_ERROR,
                payload: response 
            });
        }
    } catch (error) {
        yield put({
            type: TIME_TRACKER_TYPES.GET_TIME_TRACKER_ERROR,
            payload: { message: error?.message }
        });
    }
}



export function* getTimeTrackersaga(): any {
    yield takeEvery(TIME_TRACKER_TYPES.GET_TIME_TRACKER_FIRST, getTimeTrackerFunction);
}


function* AllTimeTrackerSaga(): any {
    yield all([
        fork(getTimeTrackersaga),
    ])
}
export default AllTimeTrackerSaga;