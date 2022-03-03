const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { UsersModel, TasksModel, GoogleModel } = require("../models/Models.js");
const passport = require("passport");

router.get("/failed", (req, res) => {
    res.send("Failed");
});

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/failed",
    }),
    async (req, res) => {
        GoogleModel.findOne({ googleId: req.user.id }, async (err, user) => {
            const userData = { displayName: req.user.displayName };

            if (user) {
                userData.id = user._id;
            } else {
                const newUser = new GoogleModel({
                    googleId: req.user.id,
                    displayName: req.user.displayName,
                });
                const result = await newUser.save();
                userData.id = result._id;
            }

            const accessToken = jwt.sign(userData, process.env.JWTSECRET);

            res.cookie("token", accessToken);
            res.redirect("/");
        });
    }
);

module.exports = router;
