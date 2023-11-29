const mongoose = require('mongoose');

const techCategory = mongoose.model(
    'techCategory', mongoose.Schema({
        name: {
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
module.exports = techCategory;