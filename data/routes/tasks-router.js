const express = require("express");
const router = express.Router();
const { UsersModel, TasksModel } = require("../models/Models.js");

// ROUTES //

router.get("/", (req, res) => {
    res.send("Hello Tasks router");
});

router.get("/list", (req, res) => {
    res.render("tasks/tasks-list");
});

router.get("/single", (req, res) => {
    res.render("tasks/tasks-single");
});

router.get("/update", (req, res) => {
    res.render("tasks/tasks-update");
});

router.get("/delete", (req, res) => {
    res.render("tasks/tasks-delete");
});
router.get("/create", (req, res) => {
    res.render("tasks/tasks-create");
});

module.exports = router;
