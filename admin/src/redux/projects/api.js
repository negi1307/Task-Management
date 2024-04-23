import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function addProjectApi(data): any {
    return api.create(URL.AddProject, data.payload)
}
export function getProjectApi(data): any {
    // console.log(data, "okok*****************************************************************************************")

    return api.get(`${URL.GetAllProject}?projectStatus=${data.payload.projectStatus}&activeStatus=${data.payload.status}&skip=${data.payload.skip}`)
    // return api.get(`${URL.GetAllProject}${data.payload.status}&skip=${data.payload?.skip}&projectStatus=${data.payload?.projectStatus}`)
}
export function updateProjectApi(data): any {
    console.log("updatedataaaa", data.payload)
    return api.update(URL.UpdateProjectDetails, data?.payload)
}
export function deleteProjectApi(data): any {
    return api.update(URL.DeleteProject, data?.payload?.id)

    // return api.update(`${URL.DeleteProject}${data?.payload?.id}`)
}
export function getProjectByIdApi(data): any {
    return api.get(URL.GetProjectById + data?.payload)
}

export function getProjectsCountApi(data): any {
    return api.get(URL.getProjectsCount)
}

export function getprojectUsersApi(data): any {
    return api.get(`${URL.projectUsers}?projectId=${data?.payload?.projectId}&page=${data.payload.page}`)
}

export function getprojectTimeSpentApi(data): any {
    return api.get(`${URL.projectTimeSpent}?projectId=${data?.payload?.projectId}`)
}