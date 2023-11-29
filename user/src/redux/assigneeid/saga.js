import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import Assigntype from '../assigneeid/constant'
import {getAssigneeApi} from '../assigneeid/api'

function* getAllAssigneeFunction({ payload }) {
    try {
        yield put({
            type: Assigntype.GET_ASSIGNEE_LOADING,
            payload: {}
        })
        const response = yield call(getAssigneeApi, { payload });
        if (response.data.status) {
            yield put({
                type: Assigntype.GET_ASSIGNEE_SUCCESS,
                payload: { ...response.data },
            });
            // yield put({
            //     type: MileStoneType.GET_ALL_MILESTONES_RESET,
            //     payload: {},
            // });
        }
        else {
            yield put({
                type: Assigntype.GET_ASSIGNEE_ERROR,
                payload: { ...response.data }
            });
        }

    } catch (error) {
        yield put({
            type: Assigntype.GET_ASSIGNEE_ERROR,
            payload: { message: error?.message }
        });

    }
}
export function* getAllAssignedSaga(): any {
    yield takeEvery(Assigntype.GET_ASSIGNEE, getAllAssigneeFunction);
}

function* AllAssigneeSaga(): any {
    yield all([

        fork(getAllAssignedSaga),


    ])
}

export default AllAssigneeSaga;