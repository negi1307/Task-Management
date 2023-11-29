import { preSales } from "./constants";

const GET_PRESALES_INITIAL_STATE = {
    data : [],
    message: "",
    loading : false
}


export const getPreSales = (state = GET_PRESALES_INITIAL_STATE, action) => {
    switch (action.type) {
        case preSales.GET_ALL_PRESALES_LOADING:
            return {
                data: GET_PRESALES_INITIAL_STATE.data,
                loading: true,
            };
        case preSales.GET_ALL_PRESALES_SUCCESS:
            return {
                data: action?.payload,
                loading: false,
            };
        case preSales.GET_ALL_PRESALES_ERROR:
            return {
                data: [],
                loading: false,
                message: action?.payload,
            };
        default:
            return { ...state };

    }
};