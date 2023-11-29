import Assigntype from '../assigneeid/constant'

export const getassignee = (data) => ({
    type: Assigntype.GET_ASSIGNEE,
    payload: data
})