import Addcomment from '../../redux/addcomment/constants';

const ADD_ALL_COMMENT = {
    data: [],
    message: '',
    loading: false,
};
const DELETE_COMMENT = {
    data: [],
    message: '',
    loading: false,
};

const UPDATE_COMMENT = {
    data: [],
    message: '',
    loading: false,
};

const GET_HISTORY = {
    data: [],
    loading: false,
    message: ""
}

const GET_ALL_COMMENT_INITAL_STATE = {
    data: [],
    message: '',
    loading: false,
};
const GET_BUGS_INITIAL_STATE = {
    data: [],
    loading: false,
    message: ""
};
const GET_SUBTASK = {
    data: [],
    loading: false,
    message: ""
};
const GET_USER_RECORD_INITIAL_STATE = {
    data: [],
    message: "",
    loading: false,
}

export const addComments = (state = ADD_ALL_COMMENT, action) => {
    switch (action.type) {
        case Addcomment.ADD_COMMENT_LOADING:
            return {
                data: ADD_ALL_COMMENT.data,
                loading: true,
            };
        case Addcomment.ADD_COMMENT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };

        case Addcomment.ADD_COMMENT_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };
    }
};

export const getAllComment = (state = GET_ALL_COMMENT_INITAL_STATE, action) => {
    switch (action.type) {
        case Addcomment.GET_COMMENT_LOADING:
            return {
                data: GET_ALL_COMMENT_INITAL_STATE.data,
                loading: true,
            };
        case Addcomment.GET_COMMENT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };

        case Addcomment.GET_COMMENT_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };
    }
};
export const deleteComment = (state = DELETE_COMMENT, action) => {
    switch (action.type) {
        case Addcomment.DELETE_TASK_LOADING:
            return {
                data: DELETE_COMMENT.data,
                loading: true,
            };
        case Addcomment.DELETE_TASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case Addcomment.DELETE_TASK_RESET:
            return {
                data: DELETE_COMMENT.data,
                loading: false,
            };

        case Addcomment.DELETE_TASK_ERROR:
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

export const updateComment = (state = UPDATE_COMMENT, action) => {
    switch (action.type) {
        case Addcomment.UPDATE_COMMENT_LOADING:
            return {
                data: UPDATE_COMMENT.data,
                loading: true,
            };
        case Addcomment.UPDATE_COMMENT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case Addcomment.UPDATE_COMMENT_RESET:
            return {
                data: UPDATE_COMMENT.data,
                loading: false,
            };

        case Addcomment.UPDATE_COMMENT_ERROR:
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

export const getHistoryReducer = (state = GET_HISTORY, action) => {
    // console.log(GET_HISTORY,'get')
    switch (action.type) {
        case Addcomment.GET_HISTORY_LOADING:
            return {
                data: GET_HISTORY.data,
                loading: true
            };
        case Addcomment.GET_HISTORY_SUCCESS:
            return {
                data: action?.payload,
                loading: false
            };
        case Addcomment.GET_HISTORY_RESET:
            return {
                data: GET_HISTORY,
                loading: false
            };
        case Addcomment.GET_HISTORY_ERROR:
            return {
                data: [],
                status: !200,
                loading: false,
                message: action?.payload,
            };;
        default:
            return { ...state };
    }
};

export const getTaskId = (state = { data: '' }, action) => {
    switch (action.type) {
        case 'getTaskId':
            return {
                data: action.payload,
            };

        default:
            return { ...state };
    }
};
export const getSubTaskReducer = (state = GET_SUBTASK, action) => {
    // console.log(GET_SUBTASK,'GETSUBTASK')
    switch (action.type) {
        case Addcomment.GET_SUBTASK_LOADING:
            return {
                data: GET_SUBTASK.data,
                loading: true
            };
        case Addcomment.GET_SUBTASK_SUCCESS:
            return {
                data: action?.payload,
                loading: false
            };
        case Addcomment.GET_SUBTASK_RESET:
            return {
                data: GET_SUBTASK,
                loading: false
            };
        case Addcomment.GET_SUBTASK_ERROR:
            return {
                data: [],
                status: !200,
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };
    }
};
export const getBugsReducer = (state = GET_BUGS_INITIAL_STATE, action) => {
    switch (action.type) {
        case Addcomment.GET_BUGS_LOADING:
            return {
                data: GET_BUGS_INITIAL_STATE.data,
                loading: true
            };
        case Addcomment.GET_BUGS_SUCCESS:
            return {
                data: action?.payload,
                loading: false
            };
        case Addcomment.GET_BUGS_RESET:
            return {
                data: GET_BUGS_INITIAL_STATE,
                loading: false
            };
        case Addcomment.GET_BUGS_ERROR:
            return {
                data: [],
                status: !200,
                loading: false,
                message: action?.payload,
            };;
        default:
            return { ...state };
    }
};
export const getUserRecordReducer = (state = GET_USER_RECORD_INITIAL_STATE, action) => {
    switch (action.type) {
        case Addcomment.GET_USER_RECORD_LOADING:
            return {
                data: GET_USER_RECORD_INITIAL_STATE.data,
                loading: true,
            };
        case Addcomment.GET_USER_RECORD_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case Addcomment.GET_USER_RECORD_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            }
        default:
            return { ...state };
    }
}