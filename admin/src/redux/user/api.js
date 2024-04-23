import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getallUsersApi(data): any {
    return api.get(URL.ALL_USERS, data.payload)
}
export function getallCategoryApi(data): any {
    // console.log(data, 'pankaj')
    return api.get(`${URL.ALL_CATEGORY}${data.payload.status}`)
}
export function deleteUserApi(data): any {
    return api.delete(`${URL.deleteUsers}?userId=${data.payload}`)
    // console.log(data, '*******************************************')
}
export function InviteUserApi(data): any {
    return api.create(URL.InviteUser, data.payload)
}
export function getallRolesApi(data): any {
    return api.get(URL.GetAllRoles, data.payload)
}
export function getCsvDataApi(data): any {
    return api.get(URL.GetCsvData + data.payload)
}

export function getuserTasksApi(data): any {
    return api.get(`${URL.userTasks}?userId=${data.payload.userId}&projectId=${data.payload.projectId}`)
}