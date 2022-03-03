const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UsersModel, TasksModel, GoogleModel } = require("../models/Models.js");
const { hashPassword, comparePassword, validateUser } = require("../utils.js");
const passport = require("passport");
require("../mongoose.js");
require("dotenv").config();

// ROUTES //

// 404 PAGE
// router.get("/", (req, res) => {
//     res.status(404).render("not-found");
// });

router.get(
    "/",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/callback",
    passport.authenticate("google", {
        failureRedirect: "/failed",
    }),
    async (req, res) => {
        UsersModel.findOne({ googleId: req.user.id }, async (err, user) => {
            const userData = { username: req.user.displayName };

            if (user) {
                userData.id = user._id;
            } else {
                const newUser = new UsersModel({
                    googleId: req.user.id,
                    username: req.user.displayName,
                });
                const result = await newUser.save();
                userData.id = result._id;
            }

            const accessToken = jwt.sign(userData, process.env.JWTSECRET);

            res.cookie("token", accessToken);
            res.redirect("/users/");
        });
    }
);

module.exports = router;
