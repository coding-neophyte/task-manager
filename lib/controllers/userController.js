const express = require('express');
const Authenticate = require('../middleware/Authenticate');
const router = express.Router();
const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserAuth = require('../middleware/UserAuth');

const cookieObject = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24,
  secure: process.env.SECURE_COOKIES === 'true',
  sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict'
};

module.exports = router.post('/signup', async (req, res, next) => {
  try{
    const newUser = await UserService.signup({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    const { email, password } = req.body;

    const token = await UserService.signin({ email, password });

    res.cookie(process.env.COOKIE_NAME, token, cookieObject);

    res.status(200).json(newUser);

  }catch(e){
    next(e);
  }

})
  .post('/login', async (req, res, next) => {
    try{
      const { email, password } = req.body;

      const token = await UserService.signin({ email, password });

      res.cookie(process.env.COOKIE_NAME, token, cookieObject);

      res.status(200).json({
        message: 'Signed In Successfully'
      });

    }catch(e){
      e.status = 401;
      next(e);
    }
  })
  .get('/me', Authenticate, async (req, res) => {
    res.json(req.user._doc);
  })
  .put('/:id', [Authenticate, UserAuth], async (req, res, next) => {
    if(req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS));
    }

    try{
      const { id } = req.params;

      const updatedInfo = await User.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true });

      const { password, ...others } = updatedInfo._doc;

      res.status(200).json(others);

    }catch(e){
      e.status = 403;
      next(e);
    }
  })
  .delete('/signout', async (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME, cookieObject).status(204).send();
  });
