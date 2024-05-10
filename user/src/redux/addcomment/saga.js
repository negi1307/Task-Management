import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import Addcomment from '../addcomment/constants';
import { addTaskCommentApi, deleteTask, updateTask, getHistoryApi, getTaskCommentApi, getBugsApi, getSubTaskApi } from '../addcomment/api';

function* addTaskCommentFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.ADD_COMMENT_LOADING,
            payload: {},
        });
        const response = yield call(addTaskCommentApi, { payload });
        if (response.data.status) {
            yield put({
                type: Addcomment.ADD_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: Addcomment.GET_ALL_MILESTONES_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: Addcomment.ADD_COMMENT_ERROR,
                payload: { ...response.data },
            });
        }
    } catch (error) {
        yield put({
            type: Addcomment.ADD_COMMENT_ERROR,
            payload: { message: error?.message },
        });
    }
}
function* getCommentsFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.GET_COMMENT_LOADING,
            payload: {},
        });
        const response = yield call(getTaskCommentApi, { payload });
        if (response.data.status) {
            yield put({
                type: Addcomment.GET_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: Addcomment.GET_ALL_MILESTONES_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: Addcomment.GET_COMMENT_ERROR,
                payload: { ...response.data },
            });
        }
    } catch (error) {
        yield put({
            type: Addcomment.GET_COMMENT_ERROR,
            payload: { message: error?.message },
        });
    }
}
function* deleteTaskCommentFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.DELETE_COMMENT_LOADING,
            payload: {},
        });
        const response = yield call(deleteTask, { payload });
        if (response.data.status) {
            yield put({
                type: Addcomment.DELETE_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: Addcomment.GET_ALL_MILESTONES_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: Addcomment.DELETE_COMMENT_ERROR,
                payload: { ...response.data },
            });
        }
    } catch (error) {
        yield put({
            type: Addcomment.DELETE_COMMENT_ERROR,
            payload: { message: error?.message },
        });
    }
}

function* updateTaskFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.UPDATE_COMMENT_LOADING,
            payload: {},
        });
        const response = yield call(updateTask, { payload });
        if (response.data.status) {
            yield put({
                type: Addcomment.UPDATE_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: Addcomment.UPDATE_COMMENT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: Addcomment.UPDATE_COMMENT_ERROR,
                payload: { ...response.data },
            });
            yield put({
                type: Addcomment.UPDATE_COMMENT_RESET,
                payload: {},
            });
        }
    } catch (error) {
        yield put({
            type: Addcomment.UPDATE_COMMENT_ERROR,
            payload: { message: error },
        });
        yield put({
            type: Addcomment.UPDATE_COMMENT_RESET,
            payload: {},
        });
    }
}

function* getHistoryFunction({ payload }) {
  

    try {
        yield put({
            type: Addcomment.GET_HISTORY_LOADING,
            payload: {}
        })
        const response = yield call(getHistoryApi, { payload });
        if (response.data.status) {
            yield put({
                type: Addcomment.GET_HISTORY_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_BUGS_RESET,
            //     payload: {},
            // });
            yield put({
                type: Addcomment.GET_HISTORY_RESET,
                payload: { ...response.data },
            });
        }
        else {
            yield put({
                type: Addcomment.GET_HISTORY_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: Addcomment.GET_HISTORY_ERROR,
            payload: { error }
        });
        yield put({
            type: Addcomment.GET_HISTORY_RESET,
            payload: {},
        });

    }
}
function* getSubTaskFunction({ payload }) {


    try {
        yield put({
            type: Addcomment.GET_SUBTASK_LOADING,
            payload: {}
        })
        const response = yield call(getSubTaskApi, { payload });
        
        if (response.data.status) {
            yield put({
                type: Addcomment.GET_SUBTASK_SUCCESS,
                payload: { ...response.data },
            });

        }
        else {
            yield put({
                type: Addcomment.GET_SUBTASK_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: Addcomment.GET_SUBTASK_ERROR,
            payload: { error }
        });
        yield put({
            type: Addcomment.GET_SUBTASK_RESET,
            payload: {},
        });

    }
}
function* getBugsFunction({ payload }) {


    try {
        yield put({
            type: Addcomment.GET_BUGS_LOADING,
            payload: {}
        })
        const response = yield call(getBugsApi, { payload });
        console.log(response,'3333333333333333333333333')
        if (response.data.status) {
            yield put({
                type: Addcomment.GET_BUGS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_BUGS_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: Addcomment.GET_BUGS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: Addcomment.GET_BUGS_ERROR,
            payload: { error }
        });
        yield put({
            type: Addcomment.GET_BUGS_RESET,
            payload: {},
        });

    }
}
function* getUserRecordFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.GET_USER_RECORD_LOADING,
            payload: {}
        })
        const response = yield call(getUserRecordApi, { payload });
        // console.log(response, 'resss')
        if (response.data.status) {
            yield put({
                type: Addcomment.GET_USER_RECORD_SUCCESS,
                payload: { ...response.data },
            });
        }
        else {
            yield put({
                type: Addcomment.GET_USER_RECORD_ERROR,
                payload: { ...response.data },
            });
        }
    }
    catch (error) {
        yield put({
            type: Addcomment.GET_USER_RECORD_ERROR,
            payload: { message: error?.message }
        });
    }
}
export function* addAllTaskCommentsSaga(): any {
    yield takeEvery(Addcomment.ADD_COMMENT, addTaskCommentFunction);
}

export function* deleteTaskCommentsSaga(): any {
    yield takeEvery(Addcomment.DELETE_COMMENT, deleteTaskCommentFunction);
}

export function* updateTaskCommentsSaga(): any {
    yield takeEvery(Addcomment.UPDATE_COMMENT, updateTaskFunction);
}

export function* getHistorySaga(): any {
    yield takeEvery(Addcomment.GET_HISTORY, getHistoryFunction);
}

export function* getCommetSaga(): any {
    yield takeEvery(Addcomment.GET_COMMENT, getCommentsFunction);
}
export function* getBugsSaga() {
    yield takeEvery(Addcomment.GET_BUGS, getBugsFunction);
}
export function* getSubTaskSaga() {
    yield takeEvery(Addcomment.GET_BUGS, getSubTaskFunction);
}
export function* getUserRecordsaga(): any {
    yield takeEvery(Addcomment.GET_USER_RECORD, getUserRecordFunction)
}
function* Addcommentsaga(): any {
    yield all([
        fork(addAllTaskCommentsSaga),
        fork(deleteTaskCommentsSaga),
        fork(updateTaskCommentsSaga),
        fork(getHistorySaga),
        fork(getCommetSaga),
        fork(getBugsSaga),
        fork(getSubTaskSaga),
        fork(getUserRecordsaga)
    ]);
}

export default Addcommentsaga;
