import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import Addcomment from '../addcomment/constants';
import { addTaskCommentApi,deleteTask,updateTask,getHistoryApi } from '../addcomment/api';


function* addTaskCommentFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.ADD_COMMENT_LOADING,
            payload: {}
        })
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
        }
        else {
            yield put({
                type: Addcomment.ADD_COMMENT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: Addcomment.ADD_COMMENT_ERROR,
            payload: { message: error?.message }
        });

    }
}

function* deleteTaskCommentFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.DELETE_COMMENT_LOADING,
            payload: {}
        })
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
        }
        else {
            yield put({
                type: Addcomment.DELETE_COMMENT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: Addcomment.DELETE_COMMENT_ERROR,
            payload: { message: error?.message }
        });

    }
}

function* updateTaskFunction({ payload }) {
    try {
        yield put({
            type: Addcomment.UPDATE_COMMENT_LOADING,
            payload: {}
        })
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
        }
        else {
            yield put({
                type: Addcomment.UPDATE_COMMENT_ERROR,
                payload: { ...response.data }
            });
            yield put({
                type: Addcomment.UPDATE_COMMENT_RESET,
                payload: {},
            });
        }

    } catch (error) {
        yield put({
            type: Addcomment.UPDATE_COMMENT_ERROR,
            payload: { message: error }
        });
        yield put({
            type: Addcomment.UPDATE_COMMENT_RESET,
            payload: {},
        });
    }
}

function* getHistroryFunction({ payload }) {
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
            //     type: Addcomment.GET_ALL_MILESTONES_RESET,
            //     payload: {},
            // });
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

export function* getHistrorySaga(): any {
    yield takeEvery(Addcomment.GET_HISTORY, getHistroryFunction);
}


function* Addcommentsaga(): any {
    yield all([

        fork(addAllTaskCommentsSaga),
        fork(deleteTaskCommentsSaga),
        fork(updateTaskCommentsSaga),
        fork(getHistrorySaga)
     


    ])
}

export default Addcommentsaga;