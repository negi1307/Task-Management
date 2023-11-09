// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { addProject, getProject, updateProject, deleteProject, getProjectById,getProjectId } from './projects/reducers';
import {
    getAllMileStones,
    deleteMileStone,
    getMileStone,
    updateMilestone,
    addAllmilstones,
    getSigleMileStone,
    getMilestoneId
} from './milestone/reducer';
import {
    addSprint,
    getAllSprints,
    deleteSprint,
    getSingleSprintReducer,
    updateSprint,
    getAllSingleSprints,
    getSprintId
} from './sprint/reducres';
import { createTaskReducer, getSigleSprintTask, getAllTaskReducer, UpdateTaskReducer,deleteTask } from './task/reducer';
import { getAllUsers, deleteUser, createUser ,getAllRoles,createUserTime} from './user/reducer';
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
import { addComments,deleteComment,updateComment,getHistoryData,getAllComment,getTaskId } from './addcomment/reducers';
import {getPriorityTaskBoard,getWeekCountTaskBoard,getTaskStatusCount,getTaskCount} from './Summary/reducer'

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
    getSingleSprintReducer,
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
    getMilestoneId,
    getSprintId,
    addComments,
    deleteComment,
    updateComment,getHistoryData,
    getPriorityTaskBoard,
    getWeekCountTaskBoard,
    getTaskStatusCount,
    getTaskCount,
    getAllComment,
    getTaskId,
    createUserTime
}): any);
