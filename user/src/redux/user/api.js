import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getallUsersApi(data): any {
    return api.get(URL.ALL_USERS, data.payload)
}
export function deleteUserApi(data): any {
    return api.delete(URL.deleteUsers + data.payload)
}
export function InviteUserApi(data): any {
    return api.create(URL.InviteUser , data.payload)
}
// user time -----------------------------
export function UserLoginTimeApi(data): any {
    return api.create(URL.userLoginTime , data.payload)
}
// user time --------------------------------
export function getallRolesApi(data): any {
    return api.get(URL.GetAllRoles, data.payload)
}