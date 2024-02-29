import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function getPreSalesApi(data): any {
    // const { status } = data?.payload
    return api.get(`${URL.GetPreSale}?skip=${data?.payload?.skip}`);
}
