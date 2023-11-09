import { all, fork, put, takeEvery, call } from 'redux-saga/effects';

import USERS_TYPES from './constant';
import { InviteUserApi, deleteUserApi, getallRolesApi, getallUsersApi,UserLoginTimeApi } from './api';

function* getAllUsersFunction({ payload }) {
    try {
        yield put({
            type: USERS_TYPES.GET_ALL_USERS_LOADING,
            payload: {}
        })
        const response = yield call(getallUsersApi, { payload });
        
        if (response.data.status) {
            yield put({
                type: USERS_TYPES.GET_ALL_USERS_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: USERS_TYPES.GET_ALL_USERS_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: USERS_TYPES.GET_ALL_USERS_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: USERS_TYPES.GET_ALL_USERS_ERROR,
            payload: { message: error?.message }
        });

    }
}
function* deleteUserFunction({ payload }) {
    try {
        yield put({
            type: USERS_TYPES.GET_DELETE_USER_LOADING,
            payload: {}
        })
        const response = yield call(deleteUserApi, { payload });
        if (response.data.status) {
            yield put({
                type: USERS_TYPES.GET_DELETE_USER_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: USERS_TYPES.GET_DELETE_USER_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: USERS_TYPES.GET_DELETE_USER_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: USERS_TYPES.GET_DELETE_USER_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: USERS_TYPES.GET_DELETE_USER_RESET,
            payload: {},
        });

    }
}
function* inviteUserFunction({ payload }) {
    try {
        yield put({
            type: USERS_TYPES.CREATE_USER_LOADING,
            payload: {}
        })
        const response = yield call(InviteUserApi, { payload });
        if (response.data.status) {
            yield put({
                type: USERS_TYPES.CREATE_USER_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: USERS_TYPES.CREATE_USER_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: USERS_TYPES.CREATE_USER_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: USERS_TYPES.CREATE_USER_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: USERS_TYPES.CREATE_USER_RESET,
            payload: {},
        });

    }
}
// login user time ----------------------------
function* UserLoginTimeFunction({ payload }) {
    try {
        yield put({
            type: USERS_TYPES.CREATE_USER_TIME_LOADING,
            payload: {}
        })
        const response = yield call(UserLoginTimeApi, { payload });
        if (response.data.status) {
            yield put({
                type: USERS_TYPES.CREATE_USER_TIMESUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: USERS_TYPES.CREATE_USER_TIME_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: USERS_TYPES.CREATE_USER_TIME_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: USERS_TYPES.CREATE_USER_TIME_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: USERS_TYPES.CREATE_USER_TIME_RESET,
            payload: {},
        });

    }
}
// login user time-----------------------------
function* getAllRolesFunction({ payload }) {
    try {
        yield put({
            type: USERS_TYPES.GET_ALL_ROLES_LOADING,
            payload: {}
        })
        const response = yield call(getallRolesApi, { payload });
        
        if (response.data.status) {
            yield put({
                type: USERS_TYPES.GET_ALL_ROLES_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: USERS_TYPES.GET_ALL_ROLES_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: USERS_TYPES.GET_ALL_ROLES_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: USERS_TYPES.GET_ALL_ROLES_ERROR,
            payload: { message: error?.message }
        });

    }
}

export function* getAllUsersSaga(): any {
    yield takeEvery(USERS_TYPES.GET_ALL_USERS, getAllUsersFunction);
}
export function* deleteUserSaga(): any {
    yield takeEvery(USERS_TYPES.DELETE_USER, deleteUserFunction);
}
export function* inviteuserSaga(): any {
    yield takeEvery(USERS_TYPES.CREATE_USER, inviteUserFunction);
}
// login user time----------------------------------
export function* loginUserTimeSaga(): any {
    yield takeEvery(USERS_TYPES.CREATE_USER_TIME, UserLoginTimeFunction);
}
// login user time----------------------------------
export function* getAllRolesSaga(): any {
    yield takeEvery(USERS_TYPES.GET_ALL_ROLES, getAllRolesFunction);
}

function* AllUsersSaga(): any {
    yield all([
        fork(getAllUsersSaga),
        fork(getAllRolesSaga),
    fork(deleteUserSaga),
    fork(inviteuserSaga),
    fork(loginUserTimeSaga)
    ])
}
export default AllUsersSaga;