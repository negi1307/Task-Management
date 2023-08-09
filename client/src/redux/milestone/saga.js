import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import MileStoneType from './constant';
import { deleteMileStoneApi, getAllMileStonesApi, getMileStoneApi } from './api';
    function* getAllMileStonesFunction({ payload }) {
        try {
            yield put({
                type: MileStoneType.GET_ALL_MILESTONES_LOADING,
                payload: {}
            })
            const response = yield call(getAllMileStonesApi, { payload });
            console.log(response,"bbbvvv")
            if (response.data.status) {
                yield put({
                    type: MileStoneType.GET_ALL_MILESTONES_SUCCESS,
                    payload: { ...response.data },
                });
                // yield put({
                //     type: MileStoneType.GET_ALL_MILESTONES_RESET,
                //     payload: {},
                // });
            }
            else {
                yield put({
                    type: MileStoneType.GET_ALL_MILESTONES_ERROR,
                    payload: { ...response.data }
                });
            }
    
        } catch (error) {
            yield put({
                type: MileStoneType.GET_ALL_MILESTONES_ERROR,
                payload: { message: error?.message }
            });
    
        }
    }
    function* MileStonedeleteFunction({ payload }) {
        try {
            yield put({
                type: MileStoneType.DELETE_MILE_STONE_LOADING,
                payload: {}
            })
            const response = yield call(deleteMileStoneApi, { payload });
            if (response.data.status) {
                yield put({
                    type: MileStoneType.DELETE_MILE_STONE_SUCCESS,
                    payload: { ...response.data },
                });
                yield put({
                    type: MileStoneType.DELETE_MILE_STONE_RESET,
                    payload: {},
                });
            }
            else {
                yield put({
                    type: MileStoneType.DELETE_MILE_STONE_ERROR,
                    payload: { ...response.data }
                });
            }
    
        } catch (error) {
            yield put({
                type: MileStoneType.DELETE_MILE_STONE_ERROR,
                payload: { message: error?.message }
            });
            yield put({
                type: MileStoneType.DELETE_MILE_STONE_RESET,
                payload: {},
            });
    
        }
    }
    function* getMileStoneFunction({ payload }) {
        try {
            yield put({
                type: MileStoneType.GET_ALL_MILESTONE_BY_ID_LOADING,
                payload: {}
            })
            const response = yield call(getMileStoneApi, { payload });
            console.log(response,"bbbvvv")
            if (response.data.status) {
                yield put({
                    type: MileStoneType.GET_ALL_MILESTONE_BY_ID_SUCCESS,
                    payload: { ...response.data },
                });
                // yield put({
                //     type: MileStoneType.GET_ALL_MILESTONE_BY_ID_RESET,
                //     payload: {},
                // });
            }
            else {
                yield put({
                    type: MileStoneType.GET_ALL_MILESTONE_BY_ID_ERROR,
                    payload: { ...response.data }
                });
            }
    
        } catch (error) {
            yield put({
                type: MileStoneType.GET_ALL_MILESTONE_BY_ID_ERROR,
                payload: { message: error?.message }
            });
    
        }
    }
    export function* getAllMileStonesSaga(): any {
        yield takeEvery(MileStoneType.GET_ALL_MILESTONES, getAllMileStonesFunction);
    }
    export function* mileStoneDeleteSaga(): any {
        yield takeEvery(MileStoneType.DELETE_MILE_STONE, MileStonedeleteFunction);
    }
    export function* getMileStoneSaga(): any {
        yield takeEvery(MileStoneType.GET_ALL_MILESTONE_BY_ID, getMileStoneFunction);
    }
    function* AllMileStonesSaga(): any {
        yield all([
 
            fork(getAllMileStonesSaga),
            fork(mileStoneDeleteSaga),
            fork(getMileStoneSaga),
   
        ])
    }
    
    export default AllMileStonesSaga;