import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function createTaskApi(data): any {
    return api.create(URL.CREATE_TASK, data.payload);
}
export function getSingleSprintTaskApi(data): any {
    // console.log(data,'111111111111111')
    return api.get(`${URL.SingleSprintTask}&sprintId=${data?.payload?.sprintId}&activeStatus=${data.payload.activeStatus}&skip=${data.payload.skip}&assigneeId=${data?.payload?.assigneeId}&status=${data?.payload?.taskStatus}`);
}
export function getAllTaskApi(data): any {
    // console.log(data,'88888888888888888888888888888888')
    return api.get(URL.GetAllTask + data?.payload?.flag + "&sprintId=" + data?.payload?.sprintId + "&status=" + data?.payload?.status + "&activeStatus=" + data?.payload?.activeStatus + "&searchString=" + data?.payload?.searchString + "&skip=" + data?.payload?.skip + "&assigneeId=" + data?.payload?.assigneeId);

}

export function getAllAssigneeNamesApi(data): any {
    return api.get(URL.getAllAssigneeName + data.payload.projectId + "&milestoneId=" + data.payload.milestoneId + "&sprintId=" + data.payload.sprintId);
}

// export function getAllTaskApi(data): any {
//     return api.get(URL.GetAllTask+data.payload.flag+"&activeStatus="+data.payload.status+"&searchString="+data.payload.searchString+"&projectId="+data.payload.projectId+"&milestoneId="+data.payload.milestoneId+"&sprintId="+data.payload.sprintId+"&skip="+data.payload.skip);
// }

export function UpdateTaskApi(data): any {
    return api.update(URL.UpdateTask, data.payload);
}

export function UpdateTaskStatusTimekApi(data): any {
    return api.update(URL.updateTaskStatusTime, data.payload);
}
export function deleteTaskApi(data): any {
    return api.delete(URL.DeleteTask + "taskId=" + data.payload.taskId);
}

export function updateTaskStatusApi(data): any {
    // console.log("update task status", data)
    return api.update(URL.UpdateTaskStatus, data.payload);

}