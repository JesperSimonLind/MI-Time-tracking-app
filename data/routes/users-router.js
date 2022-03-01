const express = require("express");
const router = express.Router();
const { UsersModel, TasksModel } = require("../models/Models.js");
const { hashPassword, comparePassword } = require("../utils.js");

// ROUTES //

router.get("/", (req, res) => {
    res.send("Hello Users router");
});

router.post("/", async (req, res) => {
    res.send("inloggad");
});

router.get("/signup", (req, res) => {
    res.render("users/users-create");
});

router.post("/signup", async (req, res) => {
    const { username, password, email, profilePic } = req.body;

    UsersModel.findOne({ username }, async (error, user) => {
        if (user) {
            res.send("Username taken");
        } else {
            const newUser = new UsersModel({
                username: username,
                password: hashPassword(password),
                email: email,
                profilePicture: profilePic,
            });
            await newUser.save();

            res.redirect("/");
        }
    });
});

router.get("/dashboard", (req, res) => {
    res.render("users/users-dashboard");
});

router.get("/update", (req, res) => {
    res.render("users/users-update");
});

module.exports = router;
