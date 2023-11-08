const mongoose = require('mongoose');

const userLogin = mongoose.model(
    'userLogin', mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        },
        loginTime:{
            type:String
        }
    },
    {
        timestamps: true
    }
    )
)
module.exports= userLogin;