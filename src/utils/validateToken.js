const dotenv = require("dotenv")
dotenv.config()

const jwt = require('jsonwebtoken')

const validateTokenJWT =  (req, res, next) => {
    const token = req.headers['x-access-token'];
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).end();

        req.userId = decoded.userId;
        next();
    });
}

module.exports = validateTokenJWT;