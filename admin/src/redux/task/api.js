import * as URL from '../../constants/endpoint';
import { APICore } from '../../helpers/api/apiCore';
const api = new APICore();

export function createTaskApi(data): any {
    return api.create(URL.CREATE_TASK, data?.payload);
}

export function createSubtaskApi(data): any {
    return api.create(URL.Create_subtask, data?.payload);
}


export function getSingleSprintTaskApi(data): any {
    return api.get(`${URL.SingleSprintTask}${data.payload.id}&activeStatus=${data.payload.activeStatus}&skip=${data.payload.skip}&status=${data.payload.taskStatus}&milestoneId=${data.payload.milestoneId}&projectId=${data.payload.projectId}${data.payload.assigneeId ? `&assigneeId=${data.payload.assigneeId}` : ''}`);
}
export function getAllTaskApi(data): any {
    return api.get(`${URL.GetAllTask}?sprintId=${data.payload.sprintId}&searchString=${data.payload.searchString}`);
}
export function UpdateTaskApi(data): any {
    return api.update(URL.UpdateTask, data.payload);
}
export function deleteTaskApi(data): any {
    return api.delete(URL.DeleteTask + data?.payload?.taskId);
}

export function updateTaskStatusApi(data): any {
    return api.update(URL.UpdateTaskStatus, data.payload);
}
export function TaskStatusApi(data): any {
    return api.update(URL.TaskStatus, data.payload);
}
export function AddCommentApi(data): any {
    return api.create(URL.ADDCOMMENT, data.payload);
}
export function getCommentApi(data): any {
    return api.get(URL.GetComment + data?.payload?.taskId);
}
export function deleteCommentApi(data): any {
    return api.delete(URL.deleteComment + data?.payload?.taskId);
}
export function UpdateCommentApi(data): any {
    return api.update(URL.updateComment, data.payload);
}
export function GetAssignUserApi(data): any {
    return api.get(`${URL.GetAssignUser}${data.payload.projectId}&milestoneId=${data.payload.milestoneId}&sprintId=${data.payload.sprintId}`);
}
export function getReporterListApi(data): any {
    return api.get(`${URL.GET_REPORTER}`);
}

export function getHistoryApi(data): any {
    return api.get(URL.getHistory, data?.payload);
}
export function getBugsApi(data): any {
    const { taskId, type } = data?.payload;
    return api.get(`${URL.getBugs}&type=${type}&taskId=${taskId}`);
}
export function getSubTaskApi(data): any {
    const { taskId } = data?.payload;
    console.log(data, 'apiiiiiii')
    return api.get(`${URL.getSubTask}&type=${'SubTask'}&taskId=${taskId}`);
}
