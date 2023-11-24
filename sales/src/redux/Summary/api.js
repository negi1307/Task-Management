import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function GetTaskSummaryApi(data): any {
    return api.get(URL.TaskSummaryDetail, data.payload);
}
export function GetPriorityGraphApi(data): any {
    return api.get(URL.PriorityGraph, data.payload);
}
export function GetTaskWeekCountApi(data): any {
    return api.get(URL.TaskWeekCount, data.payload);
}