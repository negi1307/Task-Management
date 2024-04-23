import ReportTypes from "./constant";
type AuthAction = { type: string, payload: {} | string };

export const getAllReports = (data): AuthAction => ({
    type: ReportTypes.GET_REPORT,
    payload: data
})