const { hashPassword } = require("../utils.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { UsersModel, TasksModel } = require("../models/Models.js");
const passport = require("passport");

router.get("/failed", (req, res) => {
    res.send("Failed");
});

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
        UsersModel.findOne(
            { username: req.user.displayName },
            async (err, user) => {
                const userData = { username: req.user.displayName };

                if (user) {
                    userData.userId = user._id;

                    const accessToken = jwt.sign(
                        userData,
                        process.env.JWTSECRET
                    );

                    res.cookie("token", accessToken);
                    res.redirect("/users/" + userData.userId + "/dashboard");
                } else {
                    const newUser = new UsersModel({
                        username: req.user.displayName,
                        password: hashPassword(req.user.id),
                        email: req.user.emails[0].value,
                        profilePicture: "",
                    });
                    const result = await newUser.save();
                    userData.userId = result._id;
                    const accessToken = jwt.sign(
                        userData,
                        process.env.JWTSECRET
                    );

                    res.cookie("token", accessToken);
                    res.redirect("/users/" + userData.userId + "/dashboard");
                }
            }
        );
    }
);

module.exports = router;
