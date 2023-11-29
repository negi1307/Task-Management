const mongoose = require('mongoose');

const technology = mongoose.model(
    'Technology', mongoose.Schema({
        techCategory_id: {
            type: mongoose.Types.ObjectId,
            ref : 'techCategory',
            required: true
        },
        techName: {
            type: String
        },
        status : {
            type : Boolean,
            default : true
        }
    },
        {
            timestamps: true
        }
    )
);
module.exports = technology;
