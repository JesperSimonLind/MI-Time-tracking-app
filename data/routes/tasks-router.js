const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  UsersModel,
  TasksModel
} = require("../models/Models.js");

// ROUTES //

router.get("/", (req, res) => {
  res.status(404).render("not-found");
});

router.get("/:id/list", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  // const taskCollection = await TasksModel.find().lean();
  // const studyCollection = await TasksModel.find({ category: "Study" });
  // console.log(studyCollection);
  res.render("tasks/tasks-list", {
    user
  });
});

// READ – SINGLE TASK
router.get("/:userid/:id/single", async (req, res) => {
  const user = await UsersModel.findById(req.params.userid).lean();
  const task = await TasksModel.findById(req.params.id).lean();

  TasksModel.findOne({
    _id : task
  }, function (err, task) {
    console.log(task)
    res.render("tasks/tasks-single", {task, user});

  }).lean();

});


// READ – UPDATE TASK
router.get("/:userid/:id/update", async (req, res) => {
  const user = await UsersModel.findById(req.params.userid).lean();
  const task = await TasksModel.findById(req.params.id).lean();

  TasksModel.findOne({
    _id : task
  }, function (err, task) {
    console.log(task)
    res.render("tasks/tasks-update", {task, user});

  }).lean();

  // LÄGG TILL FUNKTIONALITET FÖR ATT UPPDATERA TASK

});

// READ - DELETE TASK
router.get("/:userid/:id/delete", async (req, res) => {
  const user = await UsersModel.findById(req.params.userid).lean();
  const task = await TasksModel.findById(req.params.id).lean();

  TasksModel.findOne({
    _id : task
  }, function (err, task) {
    console.log(task)
    res.render("tasks/tasks-delete", {task, user});

  }).lean();

  // LÄGG TILL FUNKTIONALITET FÖR ATT TA BORT TASK

});

// READ – CREATE TASK
router.get("/:id/create", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  res.render("tasks/tasks-create", {
    user
  });
});

// POST – CREATE TASK
router.post("/:id/create", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();
  const {
    category,
    description,
    hours,
    private,
    created
  } = req.body;
  const {
    token
  } = req.cookies;
  const date = new Date().toLocaleDateString();

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);

    const newTask = new TasksModel({
      category: category,
      description: description,
      hours: hours,
      private: Boolean(req.body.private),
      created: date,
      user: tokenData.userId,
    });
    await newTask.save();
  }
  res.redirect("/users/" + user._id + "/dashboard");
});

// READ – STUDY CATEGORY
router.get("/:id/category/study", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();

  TasksModel.find({
    user: user._id,
    category: "Study"
  }, function (err, tasks) {
    res.render("tasks/tasks-list", {tasks, user})

  }).lean();
})

// READ – WORK CATEOGORY
router.get("/:id/category/work", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();

  TasksModel.find({
    user: user._id,
    category: "Work"
  }, function (err, tasks) {
    res.render("tasks/tasks-list", {tasks, user})

  }).lean();
})

// READ – EXERCISE CATEOGORY
router.get("/:id/category/exercise", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();

  TasksModel.find({
    user: user._id,
    category: "Exercise"
  }, function (err, tasks) {
    res.render("tasks/tasks-list", {tasks, user})

  }).lean();
})

// READ – SOMETHING ELSE COOL CATEOGORY
router.get("/:id/category/other", async (req, res) => {
  const user = await UsersModel.findById(req.params.id).lean();

  TasksModel.find({
    user: user._id,
    category: "Something else cool"
  }, function (err, tasks) {
    
    res.render("tasks/tasks-list", {tasks, user})

  }).lean();
})


module.exports = router;