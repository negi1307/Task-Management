const mongoose = require('mongoose'), { Schema } = mongoose,

    milestoneModel = new Schema({
        projectId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'projects',
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        startDate: {
            type: Date,
            required: true
        },
        completionDate: {
            type: Date,
            required: true
        },
        activeStatus: {
            type: Boolean,
            default: true
        },
        
    },
        {
            timestamps: true
        }
    )

module.exports = mongoose.model('milestone', milestoneModel)