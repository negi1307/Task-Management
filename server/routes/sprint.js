const express = require('express');
const sprintRoute = express.Router();
const path = require('../controller/sprint');
sprintRoute.get('/',path.getSprint);
sprintRoute.post('/getalltask',path.getAllTaskBySprint);
sprintRoute.post('/getsprintbyid',path.getSprintById);
sprintRoute.post('/singlemilestonesprints',path.sigleMilestoneSprints);
sprintRoute.post('/add',path.addSprint);
sprintRoute.put('/update',path.updateSprint);
sprintRoute.delete('/delete',path.deleteSprint);


module.exports = sprintRoute;