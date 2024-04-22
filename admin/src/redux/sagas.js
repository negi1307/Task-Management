// @flow
import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import AllProjectSaga from './projects/saga';
import AllMileStonesSaga from './milestone/saga';
import AllSprintSaga from './sprint/saga';
import AllTaskSaga from './task/saga';
import AllUsersSaga from './user/saga';
import AllTechnologySaga from './technology/saga';
import AllSummarySaga from "./Summary/saga"
import AllPreSaleSaga from './customer/saga';
import ClientRepositorySaga from './clientRepository/saga';
import AllTimeTrackerSaga from './timeTracker/saga';
import AllReportSaga from './report/saga'
export default function* rootSaga(): any {
  yield all([authSaga(),
  layoutSaga(),
  AllProjectSaga(),
  AllMileStonesSaga(),
  AllSprintSaga(),
  AllTaskSaga(),
  AllUsersSaga(),
  AllTechnologySaga(),
  AllSummarySaga(),
  AllPreSaleSaga(),
  ClientRepositorySaga(),
  AllTimeTrackerSaga(),
  AllReportSaga(),
  ]);
}
