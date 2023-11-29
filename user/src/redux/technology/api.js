import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function createTechnologyCategoryApi(data): any {
    return api.create(URL.AddCategoryTechnology, data.payload)
}
export function getAllTechnologyCategoryApi(data): any {
    return api.get(`${URL.GetCategoryTechnology}${data.payload.status}`)
}
    // return api.get(URL.GetTechnology + data.payload)

export function UpdateTechnologyCategoryApi(data): any {
    return api.update(URL.UpdateCategoryTechnology, data.payload)
}
export function deleteTechnologyCategoryApi(data): any {
    return api.update(URL.DeleteCategoryTechnologyy, data.payload)
}



export function createTechnologyApi(data): any {
    return api.create(URL.AddTechnology, data.payload)
}
export function getAllTechnologyApi(data): any {
    return api.get(`${URL.GetTechnology}${data.payload.status}`)
}
    // return api.get(URL.GetTechnology + data.payload)

export function UpdateTechnologyApi(data): any {
    return api.update(URL.UpdateTechnology, data.payload)
}
export function deleteTechnologyApi(data): any {
    return api.update(URL.DeleteTechnology, data.payload)
}