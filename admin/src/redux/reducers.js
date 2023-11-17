// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import {
    addProject,
    getProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectId,
} from './projects/reducers';
import {
    getAllMileStones,
    deleteMileStone,
    getMileStone,
    updateMilestone,
    addAllmilstones,
    getSigleMileStone,
    getMilestoneId,
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
    updateCommentReducer,getAssignUserReducer
} from './task/reducer';
import { getAllUsers, deleteUser, createUser, getAllRoles,getCsvDataReducer } from './user/reducer';
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
import { getPreSaleReducer,addPreSaleReducer,updatePreSaleReducer,deletePreSaleReducer } from './customer/reducer';
import {getProjectNameReducer ,uploadProjectDetail ,getuploadProjectDetailReducer} from "./clientRepository/reducers"
export default (combineReducers({
    Auth,
    Layout,
    addProject,
    getProject,
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
    getCsvDataReducer,
    getPreSaleReducer,
    addPreSaleReducer,
    updatePreSaleReducer,
    deletePreSaleReducer,
    getProjectNameReducer,uploadProjectDetail,getuploadProjectDetailReducer
}): any);
