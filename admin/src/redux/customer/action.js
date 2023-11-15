import PreSaleType from "./constant";
type AuthAction = { type: string, payload: {} | string };


export const getPreSalesData = (): AuthAction => ({
    type: PreSaleType.GET_PRE_SALE_FIRST,
})

export const addPreSalesData = (data): AuthAction => ({
    type: PreSaleType.ADD_PRE_SALE_FIRST,
    data
})

export const updatePreSalesData = (data): AuthAction => ({
    type: PreSaleType.UPDATE_PRE_SALE_FIRST,
    data
})

export const deletePreSalesData = (data): AuthAction => ({
    type: PreSaleType.DELETE_PRE_SALE_FIRST,
    data
})