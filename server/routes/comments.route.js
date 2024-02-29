const express = require("express");
const comments = require('../controller/comments.controller');
const { verifyUser } = require("../middleware/jwt.auth");
const { verify } = require("jsonwebtoken");
const commentsRoute = express.Router();

commentsRoute.post('/addComment', verifyUser, comments.addComment);
commentsRoute.get('/getTaskComment', verifyUser, comments.getTaskComment);
commentsRoute.put('/updateComment', verifyUser, comments.updateComment);
commentsRoute.delete('/deleteComment', verifyUser, comments.deleteComment);

module.exports = commentsRoute;