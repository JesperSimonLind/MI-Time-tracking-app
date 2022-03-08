// REQUIRES //

require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    UsersModel,
    TasksModel
} = require("../models/Models.js");
const {
    hashPassword,
    comparePassword,
    getUniqueFilename,
} = require("../utils.js");
const bcrypt = require("bcrypt");
const path = require("path");
const {
    default: mongoose
} = require("mongoose");

// ROUTES //

// READ – FORUM
router.get("/:id", async (req, res) => {
const user = await UsersModel.findById(req.params.id).lean();

TasksModel.find({
        user: {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
        },
    },
    function (err, tasks) {
        res.render("forum/forum-dashboard", {
            user,
            tasks
        });
    }).lean();
})


module.exports = router;
