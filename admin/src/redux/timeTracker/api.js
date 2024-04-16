import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getTimeTrackerApi(): any {
    return api.get(URL.getTimeTracker)
}

export function getUserRecordApi(data): any {
    return api.get(`${URL.getUserRecord}userId=${data.payload.userId}&startDate=${data.payload.startTime}&endDate=${data.payload.endTime}`)

}
