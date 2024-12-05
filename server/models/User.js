const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["super_admin", "instructor_admin", "instructor", "student"], 
        default: "student" 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
