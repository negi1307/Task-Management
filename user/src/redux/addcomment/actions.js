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

export const getHistoryAction = (data): AuthAction => ({
    type: Addcomment.GET_HISTORY,
    payload: data
})

export const getComment = (data) => ({
    type: Addcomment.GET_COMMENT,
    payload: data
})

export const getCommentId = (data) => ({
    type: "getTaskId",
    payload: data
})


export const getBugs = (data): AuthAction => ({
    type: Addcomment.GET_BUGS,
    payload: data
});
export const getSubTask = (data): AuthAction => ({
    type: Addcomment.GET_SUBTASK,
    payload: data
});
export const getUserRecord = (data): AuthAction => ({
    type: Addcomment.GET_USER_RECORD,
    payload: data
})
