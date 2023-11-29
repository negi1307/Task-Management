import USERS_TYPES from './constant';

const GET_ALL_USER_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};
const DELETE_USER_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};
const CREATE_USER_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};
// user Time====================================
const CREATE_USER_TIME_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};
// user Time====================================

const GET_ALL_ROLES_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const UPDATE_USER_LOGIN_TIME = {
    data: [],
    message: '',
    loading: false,
};
export const getAllUsers = (state = GET_ALL_USER_INITIAL_STATE, action) => {
    switch (action.type) {
        case USERS_TYPES.GET_ALL_USERS_LOADING:
            return {
                data: GET_ALL_USER_INITIAL_STATE.data,
                loading: true,
            };
        case USERS_TYPES.GET_ALL_USERS_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };

        case USERS_TYPES.GET_ALL_USERS_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };
    }
};
export const deleteUser = (state = DELETE_USER_INITIAL_STATE, action) => {
    switch (action.type) {
        case USERS_TYPES.GET_DELETE_USER_LOADING:
            return {
                data: DELETE_USER_INITIAL_STATE.data,
                loading: true,
            };
        case USERS_TYPES.GET_DELETE_USER_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case USERS_TYPES.GET_DELETE_USER_RESET:
            return {
                data: DELETE_USER_INITIAL_STATE.data,
                loading: false,
            };

        case USERS_TYPES.GET_DELETE_USER_ERROR:
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
export const createUser = (state = CREATE_USER_INITIAL_STATE, action) => {
    switch (action.type) {
        case USERS_TYPES.CREATE_USER_LOADING:
            return {
                data: CREATE_USER_INITIAL_STATE.data,
                loading: true,
            };
        case USERS_TYPES.CREATE_USER_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case USERS_TYPES.CREATE_USER_RESET:
            return {
                data: CREATE_USER_INITIAL_STATE.data,
                loading: false,
            };

        case USERS_TYPES.CREATE_USER_ERROR:
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

export const createUserTime = (state = CREATE_USER_TIME_INITIAL_STATE, action) => {
    switch (action.type) {
        case USERS_TYPES.CREATE_USER_TIME_LOADING:
            return {
                data: CREATE_USER_TIME_INITIAL_STATE.data,
                loading: true,
            };
        case USERS_TYPES.CREATE_USER_TIMESUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case USERS_TYPES.CREATE_USER_TIME_RESET:
            return {
                data: CREATE_USER_TIME_INITIAL_STATE.data,
                loading: false,
            };

        case USERS_TYPES.CREATE_USER_TIME_ERROR:
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
export const getAllRoles = (state = GET_ALL_ROLES_INITIAL_STATE, action) => {
    switch (action.type) {
        case USERS_TYPES.GET_ALL_ROLES_LOADING:
            return {
                data: GET_ALL_ROLES_INITIAL_STATE.data,
                loading: true,
            };
        case USERS_TYPES.GET_ALL_ROLES_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };

        case USERS_TYPES.GET_ALL_ROLES_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };
    }
};

export const updateLogoutTime = (state = UPDATE_USER_LOGIN_TIME, action) => {
    switch (action.type) {
        case USERS_TYPES.CREATE_USER_TIME_STOPSUCCESS:
            return {
                data: UPDATE_USER_LOGIN_TIME.data,
                loading: true,
            };
        case USERS_TYPES.CREATE_USER_TIME_STOPSUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case USERS_TYPES.CREATE_USER_TIME_STOP_RESET:
            return {
                data: UPDATE_USER_LOGIN_TIME.data,
                loading: false,
            };

        case USERS_TYPES.CREATE_USER_TIME_STOP_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };
    }
};
