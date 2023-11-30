import {preSales} from "./constants"


export const getPresales = (data): AuthAction => ({
    type: preSales.GET_ALL_PRESALES,
    payload: data
})