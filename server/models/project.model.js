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
                type: Number, // status :1-todo, 2- live, 3 : hold, 4 : completed 
            },
            projectType : {
                type : String
            },
            preSalesId :{
                type : mongoose.Types.ObjectId,
                ref : "preSales"
            }
        },
        {
            timestamps: true,
        }
    )

module.exports = mongoose.model("projects", projectSchema);