const mongoose = require('mongoose');

const userLogin = mongoose.model(
    'breakTime', mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        taskId: {
            type: mongoose.Types.ObjectId,
            ref: "Task"
        },
        startTime: {
            type: Date
        },
        stopTime: {
            type: Date,
        },
        break: {
            type: Number
        }
    }, {
        versionKey: false
    }
    )
)
module.exports = userLogin;