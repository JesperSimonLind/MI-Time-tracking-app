const express = require("express");
const router = express.Router();

// ROUTES //

router.get("/", (req, res) => {
  res.send("Hello Tasks router");
});

router.get("/create-task", (req, res) => {
  res.render("tasks/tasks-create");
});

module.exports = router;
