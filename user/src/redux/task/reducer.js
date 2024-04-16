
import TASK_TYPES from "./constant";
const INITIAL_STATE = {
    data: [],
    loading: false,
    message: ""
}
const GET_SINGLE_SPRINTTASK_INITIAL_STATE = {
    data: [],
    loading: false,
    message: ""
}
const GET_All_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
    message: ""
}
const GET_All_ASSIGNEE_INITIAL_STATE = {
    data: [],
    loading: false,
    message: ""
}
const UPDATE_STATUS_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
    message: ""
}
const UPDATE_STATUS_TASK_TIME_INITIAL_STATE = {
    data: [],
    loading: false,
    message: ""
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
    // console.log(GET_SINGLE_SPRINTTASK_INITIAL_STATE,'GET_SINGLE_SPRINTTASK_INITIAL_STATE')
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
    // console.log(GET_All_TASK_INITIAL_STATE,'GET_All_TASK_INITIAL_STATE')
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

export const getAllAssigneeName = (state = GET_All_ASSIGNEE_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.GET_ALL_ASSIGNEE_NAME_LOADING:
            return {
                data: GET_All_ASSIGNEE_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.GET_ALL_ASSIGNEE_NAME_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case TASK_TYPES.GET_ALL_ASSIGNEE_NAME_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};

export const UpdateTaskReducer = (state = GET_All_TASK_INITIAL_STATE, action) => {
    switch (action.type) {

        case TASK_TYPES.UPDATE_TASK_LOADING:
            return {
                data: GET_All_TASK_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.UPDATE_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.UPDATE_TASK_RESET:
            return {
                data: GET_All_TASK_INITIAL_STATE.data,
                loading: false
            }

        case TASK_TYPES.UPDATE_TASK_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};

export const UpdateTaskStatusTime = (state = UPDATE_STATUS_TASK_TIME_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.UPDATE_TASK_LOADING_STATUS_TIME:
            return {
                data: UPDATE_STATUS_TASK_TIME_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.UPDATE_TASK_SUCCESS_STATUS_TIME:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.UPDATE_TASK_RESET_STATUS_TIME:
            return {
                data: UPDATE_STATUS_TASK_TIME_INITIAL_STATE.data,
                loading: false
            }

        case TASK_TYPES.UPDATE_TASK_ERROR_STATUS_TIME:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};

export const deleteTask = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.DELETE_TASK_LOADING:
            return {
                data: INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.DELETE_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.DELETE_TASK_RESET:
            return {
                data: INITIAL_STATE.data,
                loading: false
            }

        case TASK_TYPES.DELETE_TASK_ERROR:
            return {
                data: [],
                status: 403,
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};



export const updateTaskStatus = (state = UPDATE_STATUS_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.UPDATE_TASK_STATU_LOADING:
            return {
                data: UPDATE_STATUS_TASK_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.UPDATE_TASK_STATU_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.UPDATE_TASK_STATU_ERROR:
            return {
                data: [],
                status: 403,
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};