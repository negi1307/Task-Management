const mongoose = require('mongoose'), { Schema } = mongoose,

    leaveMessageModel = new Schema({
        leaveReason: {
            type: String,
        }
    }
    )

module.exports = mongoose.model('leaveMessage', leaveMessageModel)