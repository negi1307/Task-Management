// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import {
    addProject,
    getProject,
    getProjectsCount,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectId,
    getProjectUsers,
    getProjectTimeSpent
} from './projects/reducers';
import {
    getAllMileStones,
    deleteMileStone,
    getMileStone,
    updateMilestone,
    addAllmilstones,
    getSigleMileStone,
    getMilestoneId,
    getProjectTasks,
} from './milestone/reducer';
import {
    addSprint,
    getAllSprints,
    deleteSprint,
    getSingleSprintReducer,
    updateSprint,
    getAllSingleSprints,
    getSprintId,
} from './sprint/reducres';
import {
    createTaskReducer,
    getSigleSprintTask,
    getAllTaskReducer,
    UpdateTaskReducer,
    deleteTask,
    updateTaskStatus,
    TaskStatusReducer,
    AddCommentReducer,
    getComment,
    deleteCommentReducer,
    getTaskId,
    updateCommentReducer, getAssignUserReducer, getHistoryReducer, getReporterReducer, getBugsReducer, getSubTaskReducer,
} from './task/reducer';
import { getAllUsers, getAllCategory, deleteUser, createUser, getAllRoles, getCsvDataReducer, getuserTasks } from './user/reducer';
import { getTaskSummaryReducer, getPriorityGraphReducer, getTaskWeekCountReducer } from './Summary/reducer';
import {
    createTechnologyReducer,
    getAllTechnologyReducer,
    UpdateTechnologyReducer,
    deleteTechnology,
    createTechnologyCategoryReducer,
    getAllTechnologyCategoryReducer,
    UpdateTechnologyCategoryReducer,
    deleteTechnologyCategory,
} from './technology/reducer';
import { getPreSaleReducer, addPreSaleReducer, updatePreSaleReducer, deletePreSaleReducer } from './customer/reducer';
import { getProjectNameReducer, uploadProjectDetail, getuploadProjectDetailReducer } from "./clientRepository/reducers"
import { getTimeTrackerReducer, getUserRecordReducer } from './timeTracker/reducer';
import { getReport } from './report/reducer'
export default (combineReducers({
    Auth,
    Layout,
    addProject,
    getProject,
    getProjectsCount,
    updateProject,
    deleteProject,
    getProjectById,
    getAllMileStones,
    addAllmilstones,
    deleteMileStone,
    getMileStone,
    addSprint,
    getAllSprints,
    deleteSprint,
    createTaskReducer,
    updateMilestone,
    getAllUsers,
    getAllCategory,
    deleteUser,
    updateSprint,
    getSigleMileStone,
    getSigleSprintTask,
    getAllSingleSprints,
    getAllTaskReducer,
    UpdateTaskReducer,
    createUser,
    createTechnologyReducer,
    getAllTechnologyReducer,
    UpdateTechnologyReducer,
    deleteTechnology,
    createTechnologyCategoryReducer,
    getAllTechnologyCategoryReducer,
    UpdateTechnologyCategoryReducer,
    deleteTechnologyCategory,
    getAllRoles,
    deleteTask,
    getProjectId,
    updateTaskStatus,
    getMilestoneId,
    getSprintId,
    TaskStatusReducer,
    getTaskSummaryReducer,
    getPriorityGraphReducer,
    getTaskWeekCountReducer,
    AddCommentReducer,
    getComment,
    deleteCommentReducer,
    getTaskId,
    updateCommentReducer,
    getAssignUserReducer,
    getReporterReducer,
    getCsvDataReducer,
    getPreSaleReducer,
    addPreSaleReducer,
    updatePreSaleReducer,
    deletePreSaleReducer,
    getProjectNameReducer, uploadProjectDetail, getuploadProjectDetailReducer,
    getTimeTrackerReducer, getHistoryReducer, getBugsReducer, getSubTaskReducer, getUserRecordReducer, getReport, getuserTasks, getProjectUsers, getProjectTasks, getProjectTimeSpent
}): any);
