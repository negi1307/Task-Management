import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function createTaskApi(data): any {
    return api.create(URL.CREATE_TASK, data.payload);
}
export function getSingleSprintTaskApi(data): any {
    return api.get(`${URL.SingleSprintTask}${data.payload.id}&activeStatus=${data.payload.activeStatus}&skip=${data.payload.skip}`);
}
export function getAllTaskApi(data): any {
    console.log("getAllTaskApi",getAllTaskApi)
    return api.get(URL.GetAllTask+"projectId="+data.payload.id+"&milestoneId="+data.payload.milestoneId+"&sprintId="+data.payload.sprintId+"&searchString="+data.payload.searchString);
}

export function UpdateTaskApi(data): any {
    return api.update(URL.UpdateTask, data.payload);
}
export function deleteTaskApi(data): any {
    
    return api.delete(URL.DeleteTask+"taskId="+data.payload.taskId);
}

export function updateTaskStatusApi(data): any {   
    console.log("update task status",data)
    return api.update(URL.UpdateTaskStatus, data.payload);

}