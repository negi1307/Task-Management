
import SUMMARY_TYPES from "./constant";

const GET_TASK_SUMMARY_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}

const GET_PRIORITY_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const GET_TASK_WEEK_COUNT_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}

export const getTaskSummaryReducer = (state = GET_TASK_SUMMARY_INITIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_TYPES.GET_TASK_SUMMARY_LOADING:
            return {
                data: GET_TASK_SUMMARY_INITIAL_STATE.data,
                loading: true,
            };
        case SUMMARY_TYPES.GET_TASK_SUMMARY_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case SUMMARY_TYPES.GET_TASK_SUMMARY_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};
export const getTaskWeekCountReducer = (state = GET_TASK_WEEK_COUNT_INITIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_TYPES.GET_TASK_WEEK_COUNT_LOADING:
            return {
                data: GET_TASK_WEEK_COUNT_INITIAL_STATE.data,
                loading: true,
            };
        case SUMMARY_TYPES.GET_TASK_WEEK_COUNT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case SUMMARY_TYPES.GET_TASK_WEEK_COUNT_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};
