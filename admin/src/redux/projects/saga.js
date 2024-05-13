import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import ProjectTypes from './constant';
import { addProjectApi, deleteProjectApi, getProjectApi, getProjectsCountApi, getProjectByIdApi, updateProjectApi, getprojectUsersApi, getprojectTimeSpentApi } from './api';

function* addProjectFunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.ADD_PROJECT_LOADING,
            payload: {}
        })
        const response = yield call(addProjectApi, { payload });
        if (response.data.status) {
            yield put({
                type: ProjectTypes.ADD_PROJECT_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: ProjectTypes.ADD_PROJECT_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: ProjectTypes.ADD_PROJECT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.ADD_PROJECT_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: ProjectTypes.ADD_PROJECT_RESET,
            payload: {},
        });

    }
}
function* getProjectFunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.GET_PROJECT_LOADING,
            payload: {}
        })
        const response = yield call(getProjectApi, { payload });

        if (response.data.status) {
            yield put({
                type: ProjectTypes.GET_PROJECT_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: ProjectTypes.GET_PROJECT_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: ProjectTypes.GET_PROJECT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.GET_PROJECT_ERROR,
            payload: { message: error?.message }
        });

    }
}

function* getProjectsCountFunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.GET_PROJECTS_COUNT_LOADING,
            payload: {}
        })
        const response = yield call(getProjectsCountApi, { payload });

        if (response.data.status) {
            yield put({
                type: ProjectTypes.GET_PROJECTS_COUNT_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: ProjectTypes.GET_PROJECT_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: ProjectTypes.GET_PROJECTS_COUNT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.GET_PROJECTS_COUNT_ERROR,
            payload: { message: error?.message }
        });

    }
}
function* updateProjectFunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.UPDATE_PROJECT_DETAILS_LOADING,
            payload: {}
        })
        const response = yield call(updateProjectApi, { payload });
        if (response.data.status) {
            yield put({
                type: ProjectTypes.UPDATE_PROJECT_DETAILS_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: ProjectTypes.UPDATE_PROJECT_DETAILS_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: ProjectTypes.UPDATE_PROJECT_DETAILS_ERROR,
                payload: { ...response.data }
            });
            // yield put({
            //     type: ProjectTypes.UPDATE_PROJECT_DETAILS_RESET,
            //     payload: {},
            // });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.UPDATE_PROJECT_DETAILS_ERROR,
            payload: { message: error }
        });
        // yield put({
        //     type: ProjectTypes.UPDATE_PROJECT_DETAILS_RESET,
        //     payload: {},
        // });
    }
}
function* deleteProjectFunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.DELETE_PROJECT_DETAILS_LOADING,
            payload: {}
        })
        const response = yield call(deleteProjectApi, { payload });
        if (response.data.status) {
            yield put({
                type: ProjectTypes.DELETE_PROJECT_DETAILS_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: ProjectTypes.DELETE_PROJECT_DETAILS_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: ProjectTypes.DELETE_PROJECT_DETAILS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.DELETE_PROJECT_DETAILS_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: ProjectTypes.DELETE_PROJECT_DETAILS_RESET,
            payload: {},
        });

    }
}
function* getProjectByIdFunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.GET_PROJECT_BY_ID_LOADING,
            payload: {}
        })
        const response = yield call(getProjectByIdApi, { payload });
        if (response.data.status) {
            yield put({
                type: ProjectTypes.GET_PROJECT_BY_ID_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: ProjectTypes.GET_PROJECT_BY_ID_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: ProjectTypes.GET_PROJECT_BY_ID_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.GET_PROJECT_BY_ID_ERROR,
            payload: { message: error?.message }
        });

    }
}

function* getprojectUsersfunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.GET_PROJECT_USERS_LOADING,
            payload: {}
        })
        const response = yield call(getprojectUsersApi, { payload });

        if (response.data.status) {
            yield put({
                type: ProjectTypes.GET_PROJECT_USERS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: ProjectTypes.GET_PROJECT_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: ProjectTypes.GET_PROJECT_USERS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.GET_PROJECT_USERS_ERROR,
            payload: { message: error?.message }
        });

    }
}


function* getprojectTimeSpentfunction({ payload }) {
    try {
        yield put({
            type: ProjectTypes.GET_PROJECT_TIME_SPENT_LOADING,
            payload: {}
        })
        const response = yield call(getprojectTimeSpentApi, { payload });
        if (response.data.status) {
            yield put({
                type: ProjectTypes.GET_PROJECT_TIME_SPENT_SUCCESS,
                payload: { ...response.data },
            });
        }
        else {
            yield put({
                type: ProjectTypes.GET_PROJECT_TIME_SPENT_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ProjectTypes.GET_PROJECT_TIME_SPENT_ERROR,
            payload: { message: error?.message }
        });

    }
}



export function* addProjectSaga(): any {
    yield takeEvery(ProjectTypes.ADD_PROJECT, addProjectFunction);
}
export function* getProjectSaga(): any {
    yield takeEvery(ProjectTypes.GET_PROJECT, getProjectFunction);
}
export function* getProjectsCountSaga(): any {
    yield takeEvery(ProjectTypes.GET_PROJECTS_COUNT, getProjectsCountFunction);
}
export function* updateProjectSaga(): any {
    yield takeEvery(ProjectTypes.UPDATE_PROJECT_DETAILS, updateProjectFunction);
}
export function* deleteProjectSaga(): any {
    yield takeEvery(ProjectTypes.DELETE_PROJECT_DETAILS, deleteProjectFunction);
}
export function* getProjectByIdSaga(): any {
    yield takeEvery(ProjectTypes.GET_PROJECT_BY_ID, getProjectByIdFunction);
}
export function* getprojectUsersSaga(): any {
    yield takeEvery(ProjectTypes.GET_PROJECT_USERS, getprojectUsersfunction);
}

export function* getprojectTimeSpentSaga(): any {
    yield takeEvery(ProjectTypes.GET_PROJECT_TIME_SPENT, getprojectTimeSpentfunction);
}
function* AllProjectSaga(): any {
    yield all([
        fork(addProjectSaga),
        fork(getProjectSaga),
        fork(updateProjectSaga),
        fork(deleteProjectSaga),
        fork(getProjectByIdSaga),
        fork(getProjectsCountSaga),
        fork(getprojectUsersSaga),
        fork(getprojectTimeSpentSaga),
    ])
}

export default AllProjectSaga;