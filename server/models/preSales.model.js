const mongoose = require('mongoose');

const preSalesModel = mongoose.model(
    'preSales', mongoose.Schema({
        clientName: {
            type: String,
        },
        description: {
            type: String,
        },
        projectName: {
            type: String,
        },
        stage: {
            type: String,
            enum: ['Hot', 'Medium', 'Cold']
        },
        type: {
            type: [String],
            enum: ['Mobile', 'Web']
        },
        status: {
            type: String,
            enum: ['Not Converted', 'Converted']
        }
    },
        {
            timestamps: true
        })
);
module.exports = preSalesModel;