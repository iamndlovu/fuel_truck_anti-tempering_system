const express = require("express");
const router = express.Router();
const users = require("../models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secretKey = "1019181716151413121";

router.get("/", (req, res) => {
  users
    .find()
    .exec()
    .then((_users) => {
      console.log(_users);
      res.status(200).send(_users);
    });
});

router.post("/signup", async (req, res) => {
  console.log("posting");
  var user = req.body;
  console.log(user);
  var name = user.name;
  var email = user.email;
  var phone = user.phone;
  var password = user.password;
  if (name == "" || email == "" || phone == "" || password == "") {
    console.log("missing field");
    res.status(403).send({ message: "missing field" });
  } else {
    var passwordTaken = await users.findOne({ userEmail: email });

    if (passwordTaken) {
      console.log("users already exists");
      res.status(401).send({ message: "user already exists" });
    } else {
      console.log("new user");
      bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          console.log(err);
          res.status(500).send({ message: "internal server error" });
        } else {
          const dbUser = new users({
            userName: name,
            userPassword: hash,
            userEmail: email,
            userPhone: phone,
          });

          dbUser.save();
          res.status(200).send({ message: "done" });
        }
      });
    }
  }
});

router.post("/signin", (req, res) => {
  var user = req.body;
  var email = user.email;
  var password = user.password;
  console.log(user);
  console.log("user password");
  console.log(password);
  users.findOne({ userEmail: email }).then((_user) => {
    if (_user) {
      console.log("user available");
      console.log(_user);
      bcrypt.compare(password, _user.userPassword, function (err, result) {
        // result == true
        console.log(_user.userPassword);
        if (err) {
          console.log(err);
          res.status(500).send({ message: "internal server error" });
        } else {
          console.log(result);
          if (result) {
            //authenticated
            var payload = {
              email: _user.email,
              id: _user.id,
            };
            jwt.sign(payload, secretKey, { expiresIn: 86400 }, (err, token) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: "internal server error" });
              } else {
                res.json({
                  message: "sucess",
                  token: token,
                });
              }
            });
          } else {
            //not authenticated
            console.log("not authorised");
            res.status(401).send({ message: "not authorised" });
          }
        }
      });
    } else {
      console.log("USER NOT FOUD");
      res.status(401).send({ message: "user not found" });
    }
  });
});

router.get("/delete", async (req, res) => {
  var qr = req.query;
  var id = qr.id;
  if (id == "all") {
    await users.deleteMany({});
    res.status(200).send({ message: "done" });
  } else {
    await users.deleteOne({ userEmail: id });
    res.status(200).send({ message: "done" });
  }
});

module.exports = router;
