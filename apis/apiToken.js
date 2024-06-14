const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function createToken(payload, expiresIn) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}