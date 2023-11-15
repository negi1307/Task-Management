import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()


export function getPreSaleApiEndPoint(): any {
    return api.get(URL.GetPreSale)
}
export function addPreSaleApiEndPoint(payload): any {
    const {data}=payload
    return api.create(URL.AddPreSale,data )
}

export function updatePreSaleApiEndPoint(data): any {
    return api.create(URL.UpdatePreSale, data.payload)
}
export function deletePreSaleApiEndPoint(data): any {
    const {id}=data
    return api.create(`${URL.DeletePreSale}${id}`)
}
