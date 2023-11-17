const mongoose = require('mongoose');

const projectuploads = mongoose.model(
    'projectupload', mongoose.Schema({
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: 'projects'
        },
        attachment: {
            type: String
        },
        fileName:{
            type:String
        },
        attachmentType: {
            type: String
        },
        originalName:{
            type: String
        }
        
    },
        {
            timestamps: true
        })
);
module.exports = projectuploads;