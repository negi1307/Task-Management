import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function addProjectApi(data): any {
    return api.create(URL.AddProject, data.payload),
    console.log(data,'dta')
}
export function getProjectApi(data): any {

    return api.get(URL.GetAllProject + data.payload.flag + '&projectId=' + data.payload.projectId + "&milestoneId=" + data.payload.milestoneId + "&sprintId=" + data.payload.sprintId + "&skip=" + data.payload.skip)

}
export function updateProjectApi(data): any {
    return api.update(URL.UpdateProjectDetails, data.payload)
}
export function deleteProjectApi(data): any {
    return api.update(URL.DeleteProject, data.payload)
    // return api.update(`${URL.DeleteProject}${data?.payload?.id}`)
}
export function getProjectByIdApi(data): any {
    return api.get(URL.GetProjectById + data?.payload + '&projectId=')
}

