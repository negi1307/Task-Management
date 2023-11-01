import SUMMARY_TYPE from '../Summary/action'

const GET_PRIORITY_TASKS_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}

export const getAllTaskReducer = (state = GET_PRIORITY_TASKS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_TYPE.GET_ALL_TASK_LOADING:
            return {
                data: GET_PRIORITY_TASKS_INITIAL_STATE.data,
                loading: true,
            };
        case SUMMARY_TYPE.GET_PRIORITY_TASKS_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case SUMMARY_TYPE.GET_PRIORITY_TASKS_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};