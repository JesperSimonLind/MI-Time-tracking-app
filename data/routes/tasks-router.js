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

router.get("/:id/create", async (req, res) => {
        const user = await UsersModel.findById(req.params.id).lean();
    res.render("tasks/tasks-create", { user });
});

router.post("/create", async (req, res) => {

    const { category, description, hours, private, created } = req.body;
    const { token } = req.cookies;
    const date = new Date().toLocaleDateString();
  
    if (token && jwt.verify(token, process.env.JWTSECRET)) {
        const tokenData = jwt.decode(token, process.env.JWTSECRET);

        const newTask = new TasksModel({
            category: [category],
            description: description,
            hours: hours,
            private: Boolean(req.body.private),
            created: date,
            user: tokenData.userId,
        });
        const collection = await newTask.save();
    }
    res.redirect("/tasks/list");
});

module.exports = router;
