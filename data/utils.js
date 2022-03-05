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

const getUniqueFilename = (filename) => {
        const timestamp = Date.now()

        const extension = filename.split('.').pop()

        return `${timestamp}.${extension}`
    }

module.exports = {
    hashPassword,
    comparePassword,
    getUniqueFilename
};