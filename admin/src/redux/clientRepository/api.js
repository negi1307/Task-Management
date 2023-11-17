import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getProjectNameApi(data): any {
    return api.get(URL.GetProjectName, data.payload)
}
export function uploadProjectDetailApi(data): any {
 return api.create(URL.UploadProjectDetail, data.payload)
}