import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getReportApi(data): any {

    return api.get(`${URL.getReport}?month=&skip=${data.payload.skip}`)
    // return api.get(`${URL.GetAllProject}${data.payload.status}&skip=${data.payload?.skip}&projectStatus=${data.payload?.projectStatus}`)
}