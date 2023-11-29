import SprintTypes from "./constant";
type AuthAction = { type: string, payload: {} | string };


export const addSprint = (data): AuthAction => ({
    type: SprintTypes.ADD_SPRINT,
    payload: data
})
export const getAllSprint = (data): AuthAction => ({
    type: SprintTypes.GET_ALL_SPRINT,
    payload: data
})
//start single springt------------------
export const getSingleSprint = (data): AuthAction => ({
    type: SprintTypes.GET_ALL_SINGLE_SPRINT,
    payload: data
})
//end single springt------------------
//===================getAllMilstoneSprints=================================
export const getAllMilstoneSprints = (data): AuthAction => ({
    type: SprintTypes.GET_ALL_MILESTONE_SPRINT,
    payload: data
})
//===================================================

export const deleteSprint = (data): AuthAction => ({
    type: SprintTypes.DELETE_SPRINT,
    payload: data
})
export const getSprintById = (data): AuthAction => ({
    type: SprintTypes.GET_SPRINT_BY_ID,
    payload: data
})

export const updateSprint = (data): AuthAction => ({
    type: SprintTypes.UPDATE_SPRINT,
    payload: data
})

export const getSprintId = (data): AuthAction => ({
    type:'SprintId',
    payload: data
})