
import TASK_TYPES from "./constant";
const INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const GET_SINGLE_SPRINTTASK_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const GET_All_TASK_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
export const createTaskReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.CREATE_TASK_LOADING:
            return {
                data: INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.CREATE_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.CREATE_TASK_RESET:
            return {
                data: INITIAL_STATE.data,
                loading: false,
            };
        case TASK_TYPES.CREATE_TASK_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};
export const getSigleSprintTask = (state = GET_SINGLE_SPRINTTASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.GET_SINGLE_SPRINT_TASK_LOADING:
            return {
                data: GET_SINGLE_SPRINTTASK_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.GET_SINGLE_SPRINT_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case TASK_TYPES.GET_SINGLE_SPRINT_TASK_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};

export const getAllTaskReducer = (state = GET_All_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.GET_ALL_TASK_LOADING:
            return {
                data: GET_All_TASK_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.GET_ALL_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case TASK_TYPES.GET_ALL_TASK_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};