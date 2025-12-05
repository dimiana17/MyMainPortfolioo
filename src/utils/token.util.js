const jwt = require('jsonwebtoken');

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { createToken, verifyToken };
