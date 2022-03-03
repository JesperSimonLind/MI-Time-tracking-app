// REQUIRES //

require("dotenv").config();
require("./data/mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { hashPassword, comparePassword } = require("./data/utils.js");
const usersRouter = require("./data/routes/users-router.js");
const tasksRouter = require("./data/routes/tasks-router.js");
const app = express();

app.engine(
    "hbs",
    exphbs.engine({
        defaultLayout: "main",
        extname: ".hbs",
    })
);

app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

app.use((req, res, next) => {
    const { token } = req.cookies;

    if (token && jwt.verify(token, process.env.JWTSECRET)) {
        const tokenData = jwt.decode(token, process.env.JWTSECRET);
        res.locals.loggedIn = true;
        res.locals.username = tokenData.username;
    } else {
        res.locals.loggedIn = false;
    }
    next();
});

// ROUTES //

app.get("/", (req, res) => {
    const { token } = req.cookies;

    if (token && jwt.verify(token, process.env.JWTSECRET)) {
        const tokenData = jwt.decode(token, process.env.JWTSECRET);
        res.redirect("/users/" + tokenData.userId + "/dashboard");
    } else {
        res.render("home");
    }
});

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

app.listen(8000, () => {
    console.log("http://localhost:8000/");
});
