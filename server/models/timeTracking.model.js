const mongoose = require('mongoose');

const timeTracking = mongoose.model(
    'timeTracking', mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        month: {
            type: String
        },
        timeTracking: {
            type: Number
        }
    },
        {
            timestamps: true,
        }
    )
);
module.exports = timeTracking;