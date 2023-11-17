import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import ClientRepository from './constant';
import { getProjectNameApi,uploadProjectDetailApi } from './api';

function* getProjectNameFunction({ payload }) {
    try {
        yield put({
            type: ClientRepository.GET_PROJECT_NAME_LOADING,
            payload: {}
        })
        const response = yield call(getProjectNameApi, { payload });
        if (response.data.status) {
            yield put({
                type: ClientRepository.GET_PROJECT_NAME_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: ClientRepository.GET_PROJECT_NAME_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: ClientRepository.GET_PROJECT_NAME_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ClientRepository.GET_PROJECT_NAME_ERROR,
            payload: { message: error?.message }
        });

    }
}
function* uploadProjectFunction({ payload }) {
    try {
        yield put({
            type: ClientRepository.UPLOAD_PROJECT_DETAIL_LOADING,
            payload: {}
        })
        const response = yield call(uploadProjectDetailApi, { payload });
        if (response.data.status) {
            yield put({
                type: ClientRepository.UPLOAD_PROJECT_DETAIL_SUCCESS,
                payload: { ...response.data },
            });
            yield put({
                type: ClientRepository.UPLOAD_PROJECT_DETAIL_RESET,
                payload: {},
            });
        }
        else {
            yield put({
                type: ClientRepository.UPLOAD_PROJECT_DETAIL_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: ClientRepository.UPLOAD_PROJECT_DETAIL_ERROR,
            payload: { message: error?.message }
        });
        yield put({
            type: ClientRepository.UPLOAD_PROJECT_DETAIL_RESET,
            payload: {},
        });

    }
}
export function* getProjectNameSaga(): any {
    yield takeEvery(ClientRepository.GET_PROJECT_NAME, getProjectNameFunction);
}
export function* uploadProjectDetailsSaga(): any {
    yield takeEvery(ClientRepository.UPLOAD_PROJECT_DETAIL, uploadProjectFunction);
}
function* ClientRepositorySaga(): any {
    yield all([
        fork(getProjectNameSaga),
        fork(uploadProjectDetailsSaga)
    ])
}

export default ClientRepositorySaga;