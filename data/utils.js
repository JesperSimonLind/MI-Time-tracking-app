const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const hashPassword = (password) => {
    const hashValue = bcrypt.hashSync(password, 8);
    return hashValue;
};

const comparePassword = (password, hash) => {
    const correct = bcrypt.compareSync(password, hash);
    return correct;
};

const forceAuthorize = (req, res, next) => {
    const {
        token
    } = req.cookies;

    if (token && jwt.verify(token, process.env.JWTSECRET)) {
        const tokenData = jwt.decode(token, process.env.JWTSECRET);
        next();
    } else {
        res.sendStatus(401);
    }
};

function validateUser(user) {
    let valid = true;
    valid = valid && user.password === user.confirmPassword;

    return valid;
  }

module.exports = {
    hashPassword,
    comparePassword,
    validateUser
};