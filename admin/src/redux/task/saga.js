import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import TASK_TYPES from './constant';
import { AddCommentApi, GetAssignUserApi,getReporterListApi, GetHistoryApi, GetTaskSummaryApi, TaskStatusApi, UpdateCommentApi, UpdateTaskApi, createTaskApi, deleteCommentApi, deleteTaskApi, getAllTaskApi, getCommentApi, getSingleSprintTaskApi,updateTaskStatusApi } from './api';

function* createTaskFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.CREATE_TASK_LOADING,
            payload: {}
        })
        
        const response = yield call(createTaskApi, { payload });
       console.log(response ,"hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii") ;
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.CREATE_TASK_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.CREATE_TASK_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.CREATE_TASK_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
    //    console.log(error,"mmmmmmmmmmmmmmmmmmmmmm")
        yield put({
            type: TASK_TYPES.CREATE_TASK_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.CREATE_TASK_RESET,
            payload: {},
        });
    }
}
function* getSingleSprintTaskFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_LOADING,
            payload: {}
        })
        const response = yield call(getSingleSprintTaskApi, { payload });
        console.log(response,"bbbvvv")
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_SUCCESS,
                payload: { ...response?.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_ERROR,
                payload: { ...response?.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_ERROR,
            payload: { error }
        });
 yield put({
                type: TASK_TYPES.GET_SINGLE_SPRINT_TASK_RESET,
                payload: {},
            });
    }
}
function* getAllTaskFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.GET_ALL_TASK_LOADING,
            payload: {}
        })
        const response = yield call(getAllTaskApi, { payload });
        console.log(response,"bbbvvv")
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.GET_ALL_TASK_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_ALL_TASK_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: TASK_TYPES.GET_ALL_TASK_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.GET_ALL_TASK_ERROR,
            payload: { error }
        });
         yield put({
                type: TASK_TYPES.GET_ALL_TASK_RESET,
                payload: {},
            });

    }
}
function* updateTaskFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.UPDATE_TASK_LOADING,
            payload: {}
        })
        const response = yield call(UpdateTaskApi, { payload });
        console.log(response,"bbbvvv")
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.UPDATE_TASK_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.UPDATE_TASK_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.UPDATE_TASK_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.UPDATE_TASK_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.UPDATE_TASK_RESET,
            payload: {},
        });
    }
}


function* deleteTaskFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.DELETE_TASK_LOADING,
            payload: {}
        })
        const response = yield call(deleteTaskApi, { payload });
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.DELETE_TASK_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.DELETE_TASK_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.DELETE_TASK_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.DELETE_TASK_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.DELETE_TASK_RESET,
            payload: {},
        });

    }
}
function* updateTaskStatusFunction({ payload }) {
    console.log(payload,'saga')
    try {
        yield put({
            type: TASK_TYPES.UPDATE_TASK_STATU_LOADING,
            payload: {}
        })
        const response = yield call(updateTaskStatusApi, { payload });
        console.log("dssfksf",payload)
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.UPDATE_TASK_STATU_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.UPDATE_TASK_STATU_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.UPDATE_TASK_STATU_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.UPDATE_TASK_STATU_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.UPDATE_TASK_STATU_RESET,
            payload: {},
        });

    }
}

function* TaskStatusFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.TASK_STATUS_LOADING,
            payload: {}
        })
        const response = yield call(TaskStatusApi, { payload });
        console.log("dssfksf",payload)
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.TASK_STATUS_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.TASK_STATUS_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.TASK_STATUS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.TASK_STATUS_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.TASK_STATUS_RESET,
            payload: {},
        });

    }
}
function* addCommentFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.ADD_COMMENT_LOADING,
            payload: {}
        })
        
        const response = yield call(AddCommentApi, { payload });
    //   alert(response)
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.ADD_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.ADD_COMMENT_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.ADD_COMMENT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.ADD_COMMENT_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.ADD_COMMENT_RESET,
            payload: {},
        });
    }
}

function* getCommentFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.GET_COMMENT_LOADING,
            payload: {}
        })
        const response = yield call(getCommentApi, { payload });
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.GET_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_COMMENT_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: TASK_TYPES.GET_COMMENT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.GET_COMMENT_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.GET_COMMENT_RESET,
            payload: {},
        });

    }
}
function* deleteCommentFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.DELETE_COMMENT_LOADING,
            payload: {}
        })
        const response = yield call(deleteCommentApi, { payload });
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.DELETE_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.DELETE_COMMENT_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.DELETE_COMMENT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.DELETE_COMMENT_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.DELETE_COMMENT_RESET,
            payload: {},
        });

    }
}
function* updateCommentFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.UPDATE_COMMENT_LOADING,
            payload: {}
        })
        const response = yield call(UpdateCommentApi, { payload });
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.UPDATE_COMMENT_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: TASK_TYPES.UPDATE_COMMENT_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.UPDATE_COMMENT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.UPDATE_COMMENT_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.UPDATE_COMMENT_RESET,
            payload: {},
        });

    }
}
function* AssignUserFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.GET_ASSIGN_USER_LOADING,
            payload: {}
        })
        const response = yield call(GetAssignUserApi, { payload });
        if (response.data.status == 200) {
            yield put({
                type: TASK_TYPES.GET_ASSIGN_USER_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_ASSIGN_USER_RESET,
            //     payload: {},
            // });
        }
        else if(response.data.status == 404){
            // yield put({
            //     type: TASK_TYPES.GET_ASSIGN_USER_ERROR,
            //     payload: { ...response.data }
            // });
             yield put({
                type: TASK_TYPES.GET_ASSIGN_USER_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.GET_ASSIGN_USER_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.GET_ASSIGN_USER_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.GET_ASSIGN_USER_RESET,
            payload: {},
        });
    }
}

function* getReporterFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.GET_ALL_REPORTER_LOADING,
            payload: {}
        })
        const response = yield call(getReporterListApi, { payload });
        if (response.data.status == 200) {
            yield put({
                type: TASK_TYPES.GET_ALL_REPORTER_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_ASSIGN_USER_RESET,
            //     payload: {},
            // });
        }
        else if(response.data.status == 404){
            // yield put({
            //     type: TASK_TYPES.GET_ASSIGN_USER_ERROR,
            //     payload: { ...response.data }
            // });
             yield put({
                type: TASK_TYPES.GET_ALL_REPORTER_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: TASK_TYPES.GET_ALL_REPORTER_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.GET_ALL_REPORTER_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.GET_ALL_REPORTER_RESET,
            payload: {},
        });
    }
}

function* getHistoryFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.GET_HISTORY_LOADING,
            payload: {}
        })
        const response = yield call(GetHistoryApi, { payload });
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.GET_HISTORY_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_HISTORY_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: TASK_TYPES.GET_HISTORY_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.GET_HISTORY_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.GET_HISTORY_RESET,
            payload: {},
        });

    }
}
function* getBugsFunction({ payload }) {
    try {
        yield put({
            type: TASK_TYPES.GET_BUGS_LOADING,
            payload: {}
        })
        const response = yield call(GetBugsApi, { payload });
        if (response.data.status) {
            yield put({
                type: TASK_TYPES.GET_BUGS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: TASK_TYPES.GET_HISTORY_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: TASK_TYPES.GET_BUGS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: TASK_TYPES.GET_BUGS_ERROR,
            payload: { error }
        });
        yield put({
            type: TASK_TYPES.GET_BUGS_RESET,
            payload: {},
        });

    }
}
export function* createTaskSaga(): any {
    yield takeEvery(TASK_TYPES.CREATE_TASK, createTaskFunction);
}
export function* getSingleSprintTaskSaga(): any {
    yield takeEvery(TASK_TYPES.GET_SINGLE_SPRINT_TASK, getSingleSprintTaskFunction);
}
export function* getAllTaskSaga(): any {
    yield takeEvery(TASK_TYPES.GET_ALL_TASK, getAllTaskFunction);
}
export function* updateTaskSaga(): any {
    yield takeEvery(TASK_TYPES.UPDATE_TASK, updateTaskFunction);
}
export function* deleteTaskSaga(): any {
    yield takeEvery(TASK_TYPES.DELETE_TASK, deleteTaskFunction);
}
export function* updateTaskStatusSaga(): any {
    yield takeEvery(TASK_TYPES.UPDATE_TASK_STATUS, updateTaskStatusFunction);
}
export function* TaskStatusSaga(): any {
    yield takeEvery(TASK_TYPES.TASK_STATUS, TaskStatusFunction);
}
export function* AddCommentSaga(): any {
    yield takeEvery(TASK_TYPES.ADD_COMMENT, addCommentFunction);
}
export function* getCommentSaga(): any {
    yield takeEvery(TASK_TYPES.GET_COMMENT, getCommentFunction);
}
export function* deleteCommentSaga(): any {
    yield takeEvery(TASK_TYPES.DELETE_COMMENT, deleteCommentFunction);
}
export function* updateCommentSaga(): any {
    yield takeEvery(TASK_TYPES.UPDATE_COMMENT, updateCommentFunction);
}
export function* getAssignUserSaga(): any {
    yield takeEvery(TASK_TYPES. GET_ASSIGN_USER, AssignUserFunction);
    yield takeEvery(TASK_TYPES. GET_ALL_REPORTER, getReporterFunction);
}
export function* getHistorySaga(): any {
    yield takeEvery(TASK_TYPES. GET_HISTORY, getHistoryFunction);
}
export function* getBugsSaga(): any {
    yield takeEvery(TASK_TYPES. GET_BUGS, getBugsFunction);
}
function* AllTaskSaga(): any {
    yield all([
        fork(createTaskSaga),
        fork(getSingleSprintTaskSaga),
        fork(getAllTaskSaga),
        fork(updateTaskSaga),
        fork(deleteTaskSaga),
        fork(updateTaskStatusSaga),
        fork(TaskStatusSaga),
        fork(AddCommentSaga),
        fork(getCommentSaga),
        fork(deleteCommentSaga),
        fork(updateCommentSaga),
        fork(getAssignUserSaga),
        fork (getHistorySaga),
        fork (getBugsSaga)
    ])
}
export default AllTaskSaga;