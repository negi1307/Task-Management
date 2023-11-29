import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function getprioritytaskApi(data): any {
    return api.get(URL.getPriorityTaskboard);
}

export function getweektaskApi(data): any {
    return api.get(URL.getWeekTaskCount);
}

export function gettaskstatusApi(data): any {
    return api.get(URL.getTaskStatusCount);
}


export function gettaskcountApi(data): any {
    return api.get(URL.getTaskCount);
}
