// @flow
import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import AllProjectSaga from './projects/saga';
import AllMileStonesSaga from './milestone/saga';
export default function* rootSaga(): any {
    yield all([authSaga(), layoutSaga() , AllProjectSaga(),AllMileStonesSaga()]);
}
