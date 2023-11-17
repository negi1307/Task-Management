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
            type: Number // 1:Hot, 2:Medium, 3:Cold
        },
        type: {
            type: [Number] // 1:Mobile, 2:Web
        },
        status: {
            type: Number // 0:Not Converted , 1:Converted
        }
    },
        {
            timestamps: true
        })
);
module.exports = preSalesModel;