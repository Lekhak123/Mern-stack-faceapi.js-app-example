const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 4,
        uniqure: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 14
    },
    email: {
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);