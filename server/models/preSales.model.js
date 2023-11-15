const mongoose = require('mongoose');

const clientModel = mongoose.model(
    'clientModel', mongoose.Schema({
        clientName: {
            type: String,
        },
        description:{
            type:String,
        },
        taskId: {
            type: mongoose.Types.ObjectId,
            ref: 'Task'
        },
    },
    {
        timestamps: true
    })
);
module.exports = clientModel;