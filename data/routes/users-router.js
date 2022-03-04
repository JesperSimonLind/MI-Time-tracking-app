require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UsersModel, TasksModel } = require("../models/Models.js");
const { hashPassword, comparePassword } = require("../utils.js");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

// ROUTES //

// 404 PAGE
router.get("/", (req, res) => {
    res.status(404).render("not-found");
});

// POST: LOG IN PAGE

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    UsersModel.findOne(
        {
            username,
        },
        (e, user) => {
            if (user && comparePassword(password, user.password)) {
                const userData = {
                    userId: user._id.toString(),
                    username,
                };
                const accessToken = jwt.sign(userData, process.env.JWTSECRET);
                res.cookie("token", accessToken);

                res.redirect("/users/" + user._id + "/dashboard");
            } else {
                res.render("not-found");
            }
        }
    );
});

// GET: DASHBOARD
router.get("/:id/dashboard", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();

    res.render("users/users-dashboard", {
        user,
    });
});

// GET: SIGNUP PAGE
router.get("/signup", (req, res) => {
    res.render("users/users-create");
});

// POST: SIGNUP PAGE

router.post("/signup", async (req, res) => {
    const { username, password, email, profilePic } = req.body;

    const usernameTaken =
        "That username is already taken! Please pick another one.";

    UsersModel.findOne(
        {
            username,
        },
        async (error, user) => {
            if (user) {
                res.render("users/users-create", {
                    usernameTaken,
                });
            } else {
                const newUser = new UsersModel({
                    username: username,
                    password: hashPassword(password),
                    email: email,
                    profilePicture: profilePic,
                });
                await newUser.save();

                res.redirect("/users/" + newUser._id + "/dashboard");
            }
        }
    );
});

// GET: Signout
router.get("/signout", async (req, res) => {
    res.cookie("token", "", {
        maxAge: 0,
    });
    res.redirect("/");
});

// GET: USER UPDATE SETTINGS
router.get("/:id/update", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();
    res.render("users/users-update", { user });
});

// POST: UPDATE USER SETTINGS
router.post("/:id/update", async (req, res) => {
    const { token } = req.cookies;

    await UsersModel.findOneAndUpdate(
        { _id: req.params.id },
        {
            username: req.body.username,
            password: hashPassword(req.body.password),
            email: req.body.email,
            admin: false,
            profilePicture: req.body.profilePic,
        }
    );

    if (token && jwt.verify(token, process.env.JWTSECRET)) {
        const tokenData = jwt.decode(token, process.env.JWTSECRET);
        res.redirect("/users/" + tokenData.userId + "/dashboard");
    }
});

// GET: DELETE ACCOUNT PAGE
router.get("/:id/delete", async (req, res) => {
    const user = await UsersModel.findById(req.params.id).lean();
    res.render("users/users-delete", {
        user,
    });
});

// GET: DELETE ACCOUNT PAGE
router.post("/:id/delete", async (req, res) => {
    await UsersModel.findByIdAndDelete(req.params.id);
    res.clearCookie("token");
    res.redirect("/");
});

module.exports = router;
