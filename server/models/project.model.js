const mongoose = require('mongoose'), { Schema } = mongoose,
    projectSchema = new Schema(
        {
            projectName: {
                type: String,
                required: [true, 'Project Name is required'],
            },
            clientName: {
                type: String
            },
            technology: {
                type: [mongoose.Types.ObjectId],
                ref : 'Technology'
            },
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            },
            projectDesc: {
                type: String,
            },
            activeStatus: {
                type: Boolean,
                default: true
            },
            projectStatus: {
                type: Number,
                // default: 1 // status : 1- live, 2 : hold, 3 : completed 
            },
            projectType : {
                type : String
            },
            days:{
                type: Number
            }
        },
        {
            timestamps: true,
        }
    )

module.exports = mongoose.model("projects", projectSchema);