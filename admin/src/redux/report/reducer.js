import ReportTypes from '../report/constant'

const GET_REPORT_INITIAL_STATE = {
    data: [],
    message: "",
    loading: false
}

export const getReport = (state = GET_REPORT_INITIAL_STATE, action) => {
    switch (action.type) {
        case ReportTypes.GET_REPORT_LOADING:
            return {
                data: GET_REPORT_INITIAL_STATE.data,
                loading: true,
            };
        case ReportTypes.GET_REPORT_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };


        case ReportTypes.GET_REPORT_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};