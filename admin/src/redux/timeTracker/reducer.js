
import TIME_TRACKER_TYPES from "./constant";
const GET_TIME_TRACKER_INITIAL_STATE = {
    timeTracker:[],
    loading:false,
}

export const getTimeTrackerReducer = (state = GET_TIME_TRACKER_INITIAL_STATE, action) => {
    switch (action.type) {
        case TIME_TRACKER_TYPES.GET_TIME_TRACKER_LOADING:
            return {
                timeTracker: state.timeTracker,
                loading: true,
            };
        case TIME_TRACKER_TYPES.GET_TIME_TRACKER_SUCCESS:
            return {
                timeTracker: action?.payload,
                loading: false,
            };
        case TIME_TRACKER_TYPES.GET_TIME_TRACKER_ERROR:
            return {
                timeTracker: action?.payload,
                loading: false
            }
        default:
            return { ...state };

    }
};