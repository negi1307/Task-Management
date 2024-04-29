// end points

export const AddProject = '/project/addProject';
// export const GetAllProject = "/project/getProjects?activeStatus=";
export const GetAllProject = '/task/getUserAssignments?flag=';
export const UpdateProjectDetails = '/project/update';
export const DeleteProject = '/project/updateStatus';
export const GetProjectById = '/project/getbyprojectid/';
export const GetAllMileStones = '/milestone?';
export const ProjectAllMilestones = '/milestone/getAProjectMilestones';
export const MileStoneDelete = '/milestone/updateStatus';
export const MileStoneAdd = '/milestone/add';
export const ParticularMilestoneDetail = '/milestone/getmilestonebyid/';
export const AddSprint = '/sprint/add';
export const GetAllSprints = '/sprint?';
export const DeleteSprint = '/sprint/updateStatus';
export const ParticularSprintDetail = ' /sprint/getAMilestoneAllSprints?id=';
export const getAllSingleSprint = "/task/getUserAssignments?"

export const getAllMilstoneSprint = '/sprint/getAMilestoneAllSprints';
// create task
export const CREATE_TASK = '/task/createtask';
export const UPDATE_MILESTONE = '/milestone/update';
export const ALL_USERS = '/users';
export const deleteUsers = '/users/usersDelete/';
export const UpdateSprint = '/sprint/update';
// ==================================================
export const SingleMilestone = '/milestone/getMilestones?';
//==============================================================================

export const SingleSprintTask = '/task/getTasks?';
export const GetAllTask = "/task/getTasksAccToStatus?";

export const UpdateTask = '/task/updateTask';
export const DeleteTask = '/task/deletetask?';
export const UpdateTaskStatus = '/task/updateTaskStatus';
export const InviteUser = '/users/register';
export const AddTechnology = '/technology/addTechnology';
export const GetTechnology = '/technology/getTechnology?status=';
export const UpdateTechnology = '/technology/updateTechnology';
export const DeleteTechnology = '/technology/updateTechnologyStatus';
export const AddCategoryTechnology = '/technology/addTechCategory';
export const GetCategoryTechnology = '/technology/getTechCategory?status=';
export const UpdateCategoryTechnology = '/technology/updateTechCategory';
export const DeleteCategoryTechnologyy = '/technology/updateTechCategoryStatus';
export const GetAllRoles = '/roles/getAllRoles';
//get assignee
export const GetAssignee = '/assignUser/getUserAssignments?assigneeId=';

//add comment data
export const AddTaskComment = '/comments/addComment';
export const GetComment = '/comments/getTaskComment';

export const delteTaskComment = '/comments/deleteComment?';
export const updateTaskComment = '/comments/updateComment';

export const getHistory = '/history/getHistory';

export const getPriorityTaskboard = '/task/getPriorityTasks';
export const getWeekTaskCount = '/task/getTasksWeekCount';
export const getTaskStatusCount = '/task/getTasksStatusCount';
export const getTaskCount = '/task/getTasksCount';

// user login time api-----------------------------

export const userLoginTime = '/userLogin/loginTime';
export const userLoginTimeStop = '/userLogin/updateLogoutTime';
export const userLogoutReason = '/reason/getleaveReason';

// get all assigne name on borad page========================
export const getAllAssigneeName = '/assignUser/getuserListprojectAssigned?projectId=';
// get all assigne name on borad page========================
export const updateTaskStatusTime = '/task/updateTaskStatus'
export const getBugs = "/subTask/getSubTask?"
export const getSubTask = "/subTask/getSubTask?"
