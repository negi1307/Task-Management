import Addcomment from "../../redux/addcomment/constants"

export const addComment = (data) => ({
    type: Addcomment.ADD_COMMENT,
    payload: data
})

export const deleteComment = (data) => ({
    type: Addcomment.DELETE_COMMENT,
    payload: data
})

export const updateComment = (data) => ({
    type: Addcomment.UPDATE_COMMENT,
    payload: data
})

export const getHistory = (data) => ({
    type: Addcomment.GET_HISTORY,
    payload: data
})

export const getComment = (data) => ({
    type: Addcomment.GET_COMMENT,
    payload: data
})