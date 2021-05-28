const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_signUp = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((U) => {
      if (U) {
        return res.status(409).json({
          message: "User already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                res.status(200).json({
                  message: "User created successfully",
                  data: result,
                });
              })
              .catch((error) => {
                res.status(500).json({ error });
              });
          }
        });
      }
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              { email: user.email, userId: user._id },
              process.env.JWT_KEY,
              { expiresIn: "1hr" }
            );
            return res.status(200).json({
              message: "Auth successfull",
              token,
            });
          } else {
            return res.status(401).json({
              message: "Auth Error",
            });
          }
        });
      } else {
        return res.status(401).json({
          message: "Auth Error",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
