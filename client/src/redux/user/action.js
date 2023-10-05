import ALL_USERS from "./constant";
type AuthAction = { type: string, payload: {} | string };

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