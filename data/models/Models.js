const mongoose = require("mongoose");

const userInfo = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    username: {
        type: String,
        ref: "Users",
        required: true,
    },
    profilePicture: {
        type: String,
        ref: "Users",
        required: true,
    },
});

const taskSchema = new mongoose.Schema({
    category: {
        type: String,
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
    private: {
        type: Boolean,
        required: true,
    },
    created: {
        type: String,
        required: true,
    },
    user: {
        type: userInfo,
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

const UsersModel = mongoose.model("Users", userSchema);
const TasksModel = mongoose.model("Tasks", taskSchema);

module.exports = {
    UsersModel,
    TasksModel,
};
