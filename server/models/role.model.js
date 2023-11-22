const mongoose = require('mongoose'), { Schema } = mongoose,
    rolesSchema = new Schema(
        {
            role: {
                type: String
            }
        }
    )

module.exports = mongoose.model("roles", rolesSchema);