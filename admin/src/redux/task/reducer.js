
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
const UPDATE_TASK_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const UPDATE_STATUS_TASK_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const DELETE_TASK_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const STATUS_TASK_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const GET_TASK_SUMMARY_INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const ADD_COMMENT__INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const GET_COMMENT__INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const DELETE_COMMENT__INITIAL_STATE = {
    data:[],
    loading:false,
    message:""
}
const UPDATE_COMMENT__INITIAL_STATE = {
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
    console.log(action, "actionnnn")
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

export const UpdateTaskReducer = (state = UPDATE_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.UPDATE_TASK_LOADING:
            return {
                data: UPDATE_TASK_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.UPDATE_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
            case TASK_TYPES.UPDATE_TASK_RESET:
                return {
                    data: UPDATE_TASK_INITIAL_STATE.data,
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
export const deleteTask = (state = DELETE_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.DELETE_TASK_LOADING:
            return {
                data: DELETE_TASK_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.DELETE_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.DELETE_TASK_RESET:
            return {
                data: DELETE_TASK_INITIAL_STATE.data,
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
        case TASK_TYPES.UPDATE_TASK_STATU_RESET:
            return {
                data: UPDATE_STATUS_TASK_INITIAL_STATE.data,
                loading: false
            }

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
export const TaskStatusReducer= (state = STATUS_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.TASK_STATUS_LOADING:
            return {
                data: STATUS_TASK_INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.TASK_STATUS_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.TASK_STATUS_RESET:
            return {
                data: STATUS_TASK_INITIAL_STATE.data,
                loading: false
            }

        case TASK_TYPES.TASK_STATUS_ERROR:
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
export const AddCommentReducer = (state = ADD_COMMENT__INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.ADD_COMMENT_LOADING:
            return {
                data: ADD_COMMENT__INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.ADD_COMMENT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.ADD_COMMENT_RESET:
            return {
                data: ADD_COMMENT__INITIAL_STATE.data,
                loading: false,
            };
        case TASK_TYPES.ADD_COMMENT_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};
export const getComment = (state = GET_COMMENT__INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.GET_COMMENT_LOADING:
            return {
                data: GET_COMMENT__INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.GET_COMMENT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.GET_COMMENT_RESET:
            return {
                data: GET_COMMENT__INITIAL_STATE.data,
                loading: false
            }

        case TASK_TYPES.GET_COMMENT_ERROR:
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
export const deleteCommentReducer = (state = DELETE_COMMENT__INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.DELETE_COMMENT_LOADING:
            return {
                data: DELETE_COMMENT__INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.DELETE_COMMENT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.DELETE_COMMENT_RESET:
            return {
                data: DELETE_COMMENT__INITIAL_STATE.data,
                loading: false
            }

        case TASK_TYPES.DELETE_COMMENT_ERROR:
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
export const updateCommentReducer = (state = UPDATE_COMMENT__INITIAL_STATE, action) => {
    switch (action.type) {
        case TASK_TYPES.UPDATE_COMMENT_LOADING:
            return {
                data: UPDATE_COMMENT__INITIAL_STATE.data,
                loading: true,
            };
        case TASK_TYPES.UPDATE_COMMENT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case TASK_TYPES.UPDATE_COMMENT_RESET:
            return {
                data: UPDATE_COMMENT__INITIAL_STATE.data,
                loading: false
            }

        case TASK_TYPES.UPDATE_COMMENT_ERROR:
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
export const getTaskId = (state = {data:""}, action) => {
    switch (action.type) {
        case "taskid":
            return {
                data: action.payload,
                
            };
      
        default:
            return { ...state };

    }
};