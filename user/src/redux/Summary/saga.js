import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import SUMMARY_TYPE from '../Summary/constant' 
import {getprioritytaskApi,getweektaskApi,gettaskstatusApi,gettaskcountApi} from '../Summary/api'

function* getPriorityTaskFunction({ payload }) {
    try {
        yield put({
            type: SUMMARY_TYPE.GET_PRIORITY_TASKS_LOADING,
            payload: {}
        })
        const response = yield call(getprioritytaskApi, { payload });
      
        if (response.data.status) {
            yield put({
                type: SUMMARY_TYPE.GET_PRIORITY_TASKS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: SUMMARY_TYPE.GET_PRIORITY_TASKS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: SUMMARY_TYPE.GET_PRIORITY_TASKS_ERROR,
            payload: { message: error?.message }
        });

    }
}

function* getWeekTaskCountFunction({ payload }) {
    try {
        yield put({
            type: SUMMARY_TYPE.GET_WEEK_COUNTS_LOADING,
            payload: {}
        })
        const response = yield call(getweektaskApi, { payload });
      
        if (response.data.status) {
            yield put({
                type: SUMMARY_TYPE.GET_WEEK_COUNTS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: SUMMARY_TYPE.GET_WEEK_COUNTS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: SUMMARY_TYPE.GET_WEEK_COUNTS_ERROR,
            payload: { message: error?.message }
        });

    }
}

function* getTaskStatusCountFunction({ payload }) {
    try {
        yield put({
            type: SUMMARY_TYPE.GET_STATUS_COUNTS_LOADING,
            payload: {}
        })
        const response = yield call(gettaskstatusApi, { payload });
      
        if (response.data.status) {
            yield put({
                type: SUMMARY_TYPE.GET_STATUS_COUNTS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: SUMMARY_TYPE.GET_STATUS_COUNTS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: SUMMARY_TYPE.GET_STATUS_COUNTS_ERROR,
            payload: { message: error?.message }
        });

    }
}


function* getTaskCountFunction({ payload }) {
    try {
        yield put({
            type: SUMMARY_TYPE.GET_TASK_COUNTS_LOADING,
            payload: {}
        })
        const response = yield call(gettaskcountApi, { payload });
      
        if (response.data.status) {
            yield put({
                type: SUMMARY_TYPE.GET_TASK_COUNTS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: SUMMARY_TYPE.GET_TASK_COUNTS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: SUMMARY_TYPE.GET_TASK_COUNTS_ERROR,
            payload: { message: error?.message }
        });

    }
}

export function* getPriorityTask(): any {
    yield takeEvery(SUMMARY_TYPE.GET_PRIORITY_TASKS,getPriorityTaskFunction);
}

export function* getWeekTask(): any {
    yield takeEvery(SUMMARY_TYPE.GET_WEEK_COUNTS,getWeekTaskCountFunction);
}

export function* getStatusTask(): any {
    yield takeEvery(SUMMARY_TYPE.GET_STATUS_COUNTS,getTaskStatusCountFunction);
}

export function* getTaskCount(): any {
    yield takeEvery(SUMMARY_TYPE.GET_TASK_COUNTS,getTaskCountFunction);
}

function* AllSummarySaga(): any {
    yield all([
        fork(getPriorityTask),
        fork(getWeekTask),
        fork(getStatusTask),
        fork(getTaskCount)

    ])
}
export default AllSummarySaga;