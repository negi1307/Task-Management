import Assigntype from '../assigneeid/constant'

const GET_ALL_ASSIGNEE_INTIAL_STATE={
    data: [],
    message: "",
    loading: false
}



export const getAllAssignee = (state = GET_ALL_ASSIGNEE_INTIAL_STATE, action) => {
    switch (action.type) {
        case Assigntype.GET_ASSIGNEE_LOADING:
            return {
                data: GET_ALL_ASSIGNEE_INTIAL_STATE.data,
                loading: true,
            };
        case Assigntype.GET_ASSIGNEE_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case Assigntype.GET_ASSIGNEE_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};