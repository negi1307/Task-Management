const mongoose = require('mongoose');

const userLogin = mongoose.model(
    'userLogin', mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        loginTime: {
            type: Date
        },
        logoutTime: {
            type: Date,
        },
        leaveMessageId: {
            type: mongoose.Types.ObjectId,
            ref: "leaveMessage"
        }
    },
        {
            timestamps: true
        }
    )
)
module.exports = userLogin;