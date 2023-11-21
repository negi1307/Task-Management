const mongoose = require('mongoose'), { Schema } = mongoose,

    sprintSchema = new Schema({
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: 'projects',
            required: true
        },
        milestoneId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'milestone'
        },
        sprintName: {
            type: String,
            required: true
        },
        sprintDesc: {
            type: String,
            required: false
        },
        startDate: {
            type: Date,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        },
        activeStatus: {
            type: Boolean,
            default: true
        },
        daysLeft : {
            type : Number
        }
    },
        {
            timestamps: true,
        }
    )

module.exports = mongoose.model('sprint', sprintSchema)