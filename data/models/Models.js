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
        enum: ["Study", "Exercise", "Work", "Something else cool"],
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
        minlength: 4,
        maxlength: 16,
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
        required: true,
    },
});

const forumSchema = new mongoose.Schema({
    titel: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    user: {
        type: userInfo,
        required: true,
    },
});

const UsersModel = mongoose.model("Users", userSchema);
const TasksModel = mongoose.model("Tasks", taskSchema);
const ForumModel = mongoose.model("Forum", forumSchema);

module.exports = {
    UsersModel,
    TasksModel,
    ForumModel,
};
