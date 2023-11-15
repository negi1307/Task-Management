import MileStoneType from "./constant";
type AuthAction = { type: string, payload: {} | string };


export const getPreSalesData = (data): AuthAction => ({
    type: MileStoneType.ADD_ALL_MILESTONES,
    payload: data
})

