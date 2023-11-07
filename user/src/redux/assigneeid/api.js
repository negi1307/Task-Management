import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function getAssigneeApi(data): any {
    console.log('GetAssignee', data?.payload);
    return api.get(URL.GetAssignee + '?flag=' + data?.payload?.flag);
}
