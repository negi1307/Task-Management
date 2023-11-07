import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function addProjectApi(data): any {
    return api.create(URL.AddProject, data.payload);
}
export function getProjectApi(data): any {
    console.log('data.payload.status', data.payload);
    return api.get(`${URL.GetAllProject}${data.payload.status}`);
}
export function updateProjectApi(data): any {
    console.log('update data', data.payload);
    return api.update(URL.UpdateProjectDetails, data.payload);
}
export function deleteProjectApi(data): any {
    console.log(data, 'nnnn');
    return api.update(URL.DeleteProject, data.payload);
    // return api.update(`${URL.DeleteProject}${data?.payload?.id}`)
}
export function getProjectByIdApi(data): any {
    console.log(data, 'bbbbbbbbb');
    return api.get(URL.GetProjectById + data?.payload + '&projectId=');
}
