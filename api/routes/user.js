const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
process.env.SECRET_KEY = "secret";

const validateSignUp = require("../../validation/SignUp");
const validateSignIn = require("../../validation/SignIn");

router.post("/register", (req, res) => {
  const { errors, isValid } = validateSignUp(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ res: 400, Error: "Email already exists" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
      // bcrypt.genSalt(10, (err, salt) => {
      //   bcrypt.hash(newUser.confirmPassword, salt, (err, hash) => {
      //     if (err) throw err;
      //     newUser.confirmPassword = hash;
      //     newUser
      //       .save()
      //       .then((user) => res.json(user))
      //       .catch((err) => console.log(err));
      //   });
      // });
    }
  });
});

router.post("/login", (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  const { errors, isValid } = validateSignIn(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ res: 400, Error: "Email not found" });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          {
            expiresIn: 31556926,
          },
          (err, token) => {
            if (token) {
              return res.status(201).json({
                success: true,
                res: 200,
                token: "Bearer " + token,
              });
            }
          }
        );
      } else {
        return res.status(400).json({ res: 400, Error: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
