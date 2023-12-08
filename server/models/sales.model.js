const mongoose = require('mongoose'), { Schema } = mongoose,

    salesSchema = new Schema({
        taskDescription: {
            type: String
        },
        assigneeId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: Boolean,
            default: false
        }
    },
        {
            timestamps: true
        }
    );

module.exports = mongoose.model('sales', salesSchema);