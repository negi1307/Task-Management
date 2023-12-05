import TIME_TRACKER_TYPES from "./constant";

type AuthAction = { type: string, payload: {} | string };



export const getTimeTracterAction = (): AuthAction => ({
    type: TIME_TRACKER_TYPES.GET_TIME_TRACKER_FIRST,
})



