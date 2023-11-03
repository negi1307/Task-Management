
import SUMMARY_TYPE from './constant';

type AuthAction = { type: string, payload: {} | string };

export const getPriorityTaskBoard = (data): AuthAction => ({
    type: SUMMARY_TYPE.GET_PRIORITY_TASKS,
    payload: data
})

export const getweekTaskBoard = (data): AuthAction => ({
    type: SUMMARY_TYPE.GET_WEEK_COUNTS,
    payload: data
})

export const getTaskStatusCount = (data): AuthAction => ({
    type: SUMMARY_TYPE.GET_STATUS_COUNTS,
    payload: data
})

export const getTaskCount = (data): AuthAction => ({
    type: SUMMARY_TYPE.GET_TASK_COUNTS,
    payload: data
})