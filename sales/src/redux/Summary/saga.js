import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import SUMMARY_TYPES from './constant';
import { GetPriorityGraphApi, GetTaskSummaryApi, GetTaskWeekCountApi } from './api';


function* TaskSummaryFunction({ payload }) {
    try {
        yield put({
            type: SUMMARY_TYPES.GET_TASK_SUMMARY_LOADING,
            payload: {}
        })
        const response = yield call(GetTaskSummaryApi, { payload });
        console.log("dssfksf",payload)
        if (response.data.status) {
            yield put({
                type: SUMMARY_TYPES.GET_TASK_SUMMARY_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: SUMMARY_TYPES.GET_TASK_SUMMARY_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: SUMMARY_TYPES.GET_TASK_SUMMARY_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: SUMMARY_TYPES.GET_TASK_SUMMARY_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: SUMMARY_TYPES.GET_TASK_SUMMARY_RESET,
            payload: {},
        });

    }
}
function* PriorityGraphFunction({ payload }) {
    try {
        yield put({
            type: SUMMARY_TYPES.GET_PRIORITY_GRAPH_LOADING,
            payload: {}
        })
        const response = yield call(GetPriorityGraphApi, { payload });
        console.log("dssfksf",payload)
        if (response.data.status) {
            yield put({
                type: SUMMARY_TYPES.GET_PRIORITY_GRAPH_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: SUMMARY_TYPES.GET_PRIORITY_GRAPH_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: SUMMARY_TYPES.GET_PRIORITY_GRAPH_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: SUMMARY_TYPES.GET_PRIORITY_GRAPH_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: SUMMARY_TYPES.GET_PRIORITY_GRAPH_RESET,
            payload: {},
        });

    }
}
function* TaskWeekCountFunction({ payload }) {
    try {
        yield put({
            type: SUMMARY_TYPES.GET_TASK_WEEK_COUNT_LOADING,
            payload: {}
        })
        const response = yield call(GetTaskWeekCountApi, { payload });
        console.log("dssfksf",payload)
        if (response.data.status) {
            yield put({
                type: SUMMARY_TYPES.GET_TASK_WEEK_COUNT_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: SUMMARY_TYPES.GET_TASK_WEEK_COUNT_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: SUMMARY_TYPES.GET_TASK_WEEK_COUNT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: SUMMARY_TYPES.GET_TASK_WEEK_COUNT_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: SUMMARY_TYPES.GET_TASK_WEEK_COUNT_RESET,
            payload: {},
        });

    }
}
export function* TaskSummarySaga(): any {
    yield takeEvery(SUMMARY_TYPES.GET_TASK_SUMMARY, TaskSummaryFunction);
}
export function* PriorityGraphSaga(): any {
    yield takeEvery(SUMMARY_TYPES.GET_PRIORITY_GRAPH, PriorityGraphFunction);
}
export function* TaskWeekSaga(): any {
    yield takeEvery(SUMMARY_TYPES.GET_TASK_WEEK_COUNT, TaskWeekCountFunction);
}
function* AllSummarySaga(): any {
    yield all([
        fork(TaskSummarySaga),
        fork(PriorityGraphSaga),
        fork(TaskWeekSaga)
    ])
}
export default AllSummarySaga;