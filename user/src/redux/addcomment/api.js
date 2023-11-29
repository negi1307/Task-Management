import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()


export function addTaskCommentApi(data): any {
    return api.create(URL.AddTaskComment,data?.payload) 
}

export function deleteTask(data): any {
    
    return api.delete(URL.delteTaskComment+"commentId="+data.payload.commentId);
}


export function updateTask(data): any {
    
    return api.update(URL.updateTaskComment,data.payload);
}


export function getHistoryApi(data): any {
    
    return api.get(URL.getHistory);
}


export function getTaskCommentApi(data): any {
    
    return api.get(URL.GetComment+data?.payload.taskId)
    
}