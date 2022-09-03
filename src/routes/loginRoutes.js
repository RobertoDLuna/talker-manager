const express = require('express');
const crypto = require('crypto');
const validationMiddleware = require('../middlewares/validationMiddleware');

const login = express.Router();

login.use(validationMiddleware);

login.post('/', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = crypto.randomBytes(8).toString('hex');  
    console.log(token);
    return res.status(200).json({ token });
  }
});

module.exports = login;
