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
    validateUser
} = require("../utils.js");

// ROUTES //

router.get("/", (req, res) => {
    res.status(404).render("not-found");
});

router.post("/", async (req, res) => {
    const {
        username,
        password
    } = req.body;

    UsersModel.findOne({
        username
    }, (e, user) => {


        if (user && comparePassword(password, user.password)) {
            const userData = {
                userId: user._id.toString(),
                username
            };
            const accessToken = jwt.sign(userData, process.env.JWTSECRET);
            res.cookie("token", accessToken);
            res.redirect("users/dashboard");
        } else {
            res.render("not-found");
        }
    });
});

router.get("/signup", (req, res) => {
    res.render("users/users-create");
});

router.post("/signup", async (req, res) => {
    const { username, password, email, profilePic } = req.body;

    const usernameTaken = "That username is already taken! Please pick another one.";

    UsersModel.findOne({ username }, async (error, user) => {
        if (user) {
            res.render("users/users-create", 
            {usernameTaken}
            );
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

router.get("/signout", async (req, res) => {
    res.cookie("token", "", {
        maxAge: 0
    });
    res.redirect("/");
});

router.get("/dashboard", (req, res) => {
    res.render("users/users-dashboard");
});

router.get("/update", (req, res) => {
    res.render("users/users-update");
});

module.exports = router;