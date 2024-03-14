const mongoose = require('mongoose'), { Schema } = mongoose,
    projectSchema = new Schema(
        {
            projectName: {
                type: String,
            },
            clientName: {
                type: String
            },
            technology: {
                type: [mongoose.Types.ObjectId],
                ref: 'Technology'
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
                type: String // Ongoing, Support, Delivered
            },
            projectType: {
                type: String
            },
            preSalesId: {
                type: mongoose.Types.ObjectId,
                ref: "preSales"
            }
        },
        {
            timestamps: true,
        }
    )

module.exports = mongoose.model("projects", projectSchema);