import SUMMARY_TYPE from './constant'

const GET_PRIORITY_TASKS_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}

const GET_PRIORITY_WEEK_TASKS__COUNT_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}


const GET_PRIORITY_TASKS_STATUS_COUNT_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}

const GET_TASKS_COUNT_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}


export const getPriorityTaskBoard = (state = GET_PRIORITY_TASKS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_TYPE.GET_PRIORITY_TASKS_LOADING:
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



export const getWeekCountTaskBoard = (state = GET_PRIORITY_WEEK_TASKS__COUNT_INITIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_TYPE.GET_WEEK_COUNTS_LOADING:
            return {
                data: GET_PRIORITY_WEEK_TASKS__COUNT_INITIAL_STATE.data,
                loading: true,
            };
        case SUMMARY_TYPE.GET_WEEK_COUNTS_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case SUMMARY_TYPE.GET_WEEK_COUNTS_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};

export const getTaskStatusCount = (state = GET_PRIORITY_TASKS_STATUS_COUNT_INITIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_TYPE.GET_STATUS_COUNTS_LOADING:
            return {
                data: GET_PRIORITY_TASKS_STATUS_COUNT_INITIAL_STATE.data,
                loading: true,
            };
        case SUMMARY_TYPE.GET_STATUS_COUNTS_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case SUMMARY_TYPE.GET_STATUS_COUNTS_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};

export const getTaskCount = (state = GET_TASKS_COUNT_INITIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_TYPE.GET_TASK_COUNTS_LOADING:
            return {
                data: GET_TASKS_COUNT_INITIAL_STATE.data,
                loading: true,
            };
        case SUMMARY_TYPE.GET_TASK_COUNTS_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case SUMMARY_TYPE.GET_TASK_COUNTS_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};