const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    category: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hours: {
        type: Number,
        required: true,
    },
    public: {
        type: Boolean,
        required: true,
    },
    created: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    profilePicture: {
        type: String,
        required: false,
    },
});

const googleSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
});

const UsersModel = mongoose.model("Users", userSchema);
const TasksModel = mongoose.model("Tasks", taskSchema);
const GoogleModel = mongoose.model("Google", googleSchema);

module.exports = {
    UsersModel,
    TasksModel,
    GoogleModel,
};
