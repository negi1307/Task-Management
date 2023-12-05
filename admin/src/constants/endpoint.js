// end points
export const AddProject = "/project/addProject";
export const GetAllProject = "/project/getProjects?activeStatus=";
export const UpdateProjectDetails = "/project/update";
export const DeleteProject = "/project/updateStatus";
export const GetProjectName ="/project/getProjectName";
export const UploadProjectDetail = "/project/upload";
export const getUploadProjectDetail ="/project/files?skip="
// // 
export const GetProjectById = "/project/getbyprojectid/";

export const GetAllMileStones = "/milestone?";
// // 
export const MileStoneDelete = "/milestone/updateStatus"
export const MileStoneAdd = "/milestone/add"
export const AddSprint = "/sprint/add";
// // 
export const ParticularMilestoneDetail = "/milestone/getmilestonebyid/";
export const GetAllSprints = "/sprint?";
// // 
export const DeleteSprint = "/sprint/updateStatus";
export const getAllSingleSprint ="/sprint/getAMilestoneAllSprints?milestoneId="
// create task 
export const CREATE_TASK = "/task/createtask";
export const UPDATE_MILESTONE = "/milestone/update";
export const ALL_USERS = "/users";
export const deleteUsers = "/users/usersDelete/";
export const UpdateSprint = "/sprint/update";
export const SingleMilestone = "/milestone/getMilestones?projectId="
export const SingleSprintTask = "/task/getTasks?sprintId="
export const GetAllTask = "/task/getTasksAccToStatus?projectId="
export const UpdateTask = "/task/updateTask"
export const DeleteTask = "/task/deletetask?taskId="
export const UpdateTaskStatus = "/task/updateTaskStatus"
export const TaskStatus ="/task/updateTaskActiveStatus"

export const InviteUser = "/users/register"
export const AddTechnology ="/technology/addTechnology"
export const GetTechnology ="/technology/getTechnology?status="
export const UpdateTechnology ="/technology/updateTechnology"
export const DeleteTechnology ="/technology/updateTechnologyStatus"
export const AddCategoryTechnology ="/technology/addTechCategory"
export const GetCategoryTechnology ="/technology/getTechCategory?status="
export const UpdateCategoryTechnology ="/technology/updateTechCategory"
export const DeleteCategoryTechnologyy ="/technology/updateTechCategoryStatus"
export const GetAllRoles ="/roles/getAllRoles"
export const TaskSummaryDetail ="/task/getTasksStatusCount"
export const PriorityGraph ="/task/getPriorityTasks"
export const TaskWeekCount ="/task/getTasksWeekCount"
export const ADDCOMMENT ="/comments/addComment"
export const GetComment ="/comments/getTaskComment?taskId="
export const deleteComment ="/comments/deleteComment?commentId="
export const updateComment ="/comments/updateComment"
export const GetAssignUser ="/assignUser/getuserListprojectAssigned?projectId=" 
export const GetCsvData ="/userLogin/getLoginTimeFile?userId=" 

export const GetPreSale ="/preSale/getPreSalesData?skip=" 
export const AddPreSale ="/preSale/addPreSalesData" 
export const UpdatePreSale ="preSale/updatePreSales" 
export const DeletePreSale ="/preSale/deletePreSales?preSalesId=" 

export const getTimeTracker ="/users/trackTime" 


