const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { UsersModel, TasksModel } = require("../models/Models.js");

// ROUTES //

router.get("/", (req, res) => {
    res.status(404).render("not-found");
});

router.get("/list", async (req, res) => {
    // const taskCollection = await TasksModel.find().lean();
    // const studyCollection = await TasksModel.find({ category: "Study" });
    // console.log(studyCollection);
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
router.get("/create", async (req, res) => {
    res.render("tasks/tasks-create");
});

router.post("/create", async (req, res) => {
    const { category, description, hours, public, created } = req.body;
    const { token } = req.cookies;
    const date = new Date().toISOString();

    console.log(req.body);

    if (token && jwt.verify(token, process.env.JWTSECRET)) {
        const tokenData = jwt.decode(token, process.env.JWTSECRET);

        const newTask = new TasksModel({
            category: [category],
            description: description,
            hours: hours,
            public: true,
            created: date,
            user: tokenData.userId,
        });
        const collection = await newTask.save();
    }
    res.redirect("/tasks/list");
});

module.exports = router;
