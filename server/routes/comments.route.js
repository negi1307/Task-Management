const express = require("express");
const comments = require('../controller/comments.controller');
const { verifyUser } = require("../middleware/jwt.auth");
const commentsRoute = express.Router();

commentsRoute.post('/addComment', verifyUser, comments.addComment);
commentsRoute.get('/getTaskComment', comments.getTaskComment);
commentsRoute.put('/updateComment', comments.updateComment);
commentsRoute.delete('/deleteComment', comments.deleteComment);

module.exports = commentsRoute;