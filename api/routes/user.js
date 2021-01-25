const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
process.env.SECRET_KEY = "secret";
const { OAuth2Client } = require("google-auth-library");
const multer = require("multer");
const path = require("path");

// const client = new OAuth2Client(
//   "342148260884-dfd3n8vics5h243jgmac95lmjj63btpk.apps.googleusercontent.com"
// );

const validateSignUp = require("../../validation/SignUp");
const validateSignIn = require("../../validation/SignIn");
const { route } = require("./featureArtists");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myImage");

router.post("/upload", (req, res) =>
  upload(req, res, (err) => {
    return res.send({
      success: true,
      data: req.file,
    });
    if (!err) return res.send(200).end();
  })
);

router.get("/user-details/:id", (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid record found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

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
                userData: user,
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

router.put("/update/:userId", (req, res, next) => {
  const id = req.params.userId;
  let profileLink = `https://music-player-app26.herokuapp.com/uploads/${req.body.filename}`;

  User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        email: req.body.email,
        profileImage: profileLink,
      },
    },
    { new: true }
  )
    .exec()
    .then((result) => {
      res
        .status(200)
        .json({ result, message: "Profile Updated Successfully " });
    })
    .catch((err) => {
      console.log(500).json({
        error: err,
      });
    });
});

router.post("/google-login", (req, res) => {
  const client = new OAuth2Client(
    "342148260884-dfd3n8vics5h243jgmac95lmjj63btpk.apps.googleusercontent.com"
  );
  const { idToken } = req.body;
  client
    .verifyIdToken({
      idToken,
      audience:
        "342148260884-dfd3n8vics5h243jgmac95lmjj63btpk.apps.googleusercontent.com",
    })
    .then((response) => {
      console.log(response, "GRESPONSE");
      const {
        email_verified,
        name,
        email,
        given_name,
        family_name,
      } = response.payload;

      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: "Something went wrong1...",
            });
          } else {
            if (user) {
              const token = jwt.sign(
                { _id: user._id },
                process.env.SECRET_KEY,
                { expiresIn: "7d" }
              );
              const { _id, name, email } = user;
              res.json({
                token,
                userData: user,
              });
            } else {
              let password = email + process.env.SECRET_KEY;
              let userName = name;
              let firstName = given_name;
              let lastName = family_name;

              let newUser = new User({
                userName,
                email,
                // password,
                firstName,
                lastName,
              });
              newUser.save((err, data) => {
                if (err) {
                  console.log(err);

                  return res.status(400).json({
                    error: "Something went wrong2...",
                  });
                }
                const token = jwt.sign(
                  { _id: data._id },
                  process.env.SECRET_KEY,
                  { expiresIn: "7d" }
                );
                const { _id, name, email } = newUser;
                res.json({
                  token,
                  userData: newUser,
                });
              });
            }
          }
        });
      }
    });
});

router.put("/change-password/:profileId", (req, res, next) => {
  console.log(req.body);
  const id = req.params.profileId;
  User.findById(id)
    .exec()
    .then((doc) => {
      bcrypt.compare(
        req.body.currentPassword,
        doc.password,
        function (err, matches) {
          if (err) {
            res.status(404).json({ message: "Error while checking password" });
          } else if (matches) {
            console.log("matched");
            if (req.body.password === req.body.confirmPassword) {
              console.log("1111111");
              User.findByIdAndUpdate(
                { _id: id },
                {
                  $set: {
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword,
                  },
                },
                { new: true }
              )
                .exec()
                .then((result) => {
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(result.password, salt, (err, hash) => {
                      if (err) throw err;
                      result.password = hash;
                      result
                        .save()
                        .then(
                          (user) =>
                            res.status(200).json({
                              message: "Password Changed Successfuly",
                              user,
                            })
                          // res.json(
                          //   { message: "Password Changed Successfuly " },
                          //   user
                          // )
                        )
                        .catch((err) => console.log(err));
                    });
                  });

                  // console.log(result);
                  // res.status(200).json(result);
                })
                .catch((err) => {
                  console.log(err);
                  console.log(500).json({
                    error: err,
                  });
                });
            } else {
              res.status(404).json({
                message: "Password & Confirm Password Does Not Match",
              });
            }
          } else {
            res
              .status(404)
              .json({ message: "Current Password Does Not Match" });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

// const user = req.user;

// bcrypt.compare(req.body.password, user.password,
//       (err, result) =>
//       {
//         if (req.body.password == req.body.newpassword) {
//             res.send(err);
//           }
//         else {
//             if (result == false) {
//                 res.send({
//                     success: false,
//                     message: ' password is not matched'
//                 });
//             }
//             else {
//                 dbchange_password.update({
//                     password: req.body.newpassword

//                 }, { where: { email_id: user.email_id } }
//                 ).then((result) =>
//                     res.send(result)
//                 )
//             }
//         }
//     })
// });
