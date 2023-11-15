import ALL_USERS from "./constant";
type AuthAction = { type: string, payload: {} | string };


// addd login tIME ------------------------------------
export const addLoginTime = (data): AuthAction => ({
    type: ALL_USERS.CREATE_USER_TIME,
    payload: data
})
// addd login tIME ------------------------------------

export const getAllUsers = (data): AuthAction => ({
    type: ALL_USERS.GET_ALL_USERS,
    payload: data
})
export const deleteUser= (data): AuthAction => ({
    type: ALL_USERS.DELETE_USER,
    payload: data
})
export const inviteUser= (data): AuthAction => ({
    type: ALL_USERS.CREATE_USER,
    payload: data
})
export const getAllRoles = (data): AuthAction => ({
    type: ALL_USERS.GET_ALL_ROLES,
    payload: data
})