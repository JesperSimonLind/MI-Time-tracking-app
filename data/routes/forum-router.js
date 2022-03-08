const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { UsersModel, TasksModel, ForumModel } = require("../models/Models.js");

router.get("/", (req, res) => {
    res.render("forum-dashboard");
});
