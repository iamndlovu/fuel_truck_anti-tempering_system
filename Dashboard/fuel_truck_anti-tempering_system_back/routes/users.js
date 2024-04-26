const express = require('express');
const router = express.Router();
const users = require('../models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secretKey = '1019181716151413121';

router.get('/', (req, res) => {
  users
    .find()
    .exec()
    .then((_users) => {
      console.log(_users);
      res.status(200).json(_users);
    });
});

router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (name == '' || email == '' || phone == '' || password == '') {
    console.log('missing field');
    res.status(403).send({ message: 'missing field' });
  } else {
    const passwordTaken = await users.findOne({ userEmail: email });

    if (passwordTaken) {
      console.log('users already exists');
      res.status(401).send({ message: 'user already exists' });
    } else {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          console.log(err);
          res.status(500).send({ message: 'internal server error' });
        } else {
          const dbUser = new users({
            userName: name,
            userPassword: hash,
            userEmail: email,
            userPhone: phone,
          });

          dbUser.save();
          res.status(200).send({ message: 'done' });
        }
      });
    }
  }
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  users.findOne({ userEmail: email }).then((_user) => {
    if (_user) {
      bcrypt.compare(password, _user.userPassword, function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).send({ message: 'internal server error' });
        } else {
          if (result) {
            //authenticated
            const payload = {
              email: _user.email,
              id: _user.id,
            };
            jwt.sign(payload, secretKey, { expiresIn: 86400 }, (err, token) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: 'internal server error' });
              } else {
                res.json({
                  message: 'sucess',
                  token: token,
                });
              }
            });
          } else {
            //not authenticated
            console.log('not authorised');
            res.status(401).send({ message: 'not authorised' });
          }
        }
      });
    } else {
      console.log('USER NOT FOUD');
      res.status(401).send({ message: 'user not found' });
    }
  });
});

router.get('/delete', async (req, res) => {
  const { id } = req.query;
  if (id == 'all') {
    await users.deleteMany({});
    res.status(200).send({ message: 'done' });
  } else {
    await users.deleteOne({ userEmail: id });
    res.status(200).send({ message: 'done' });
  }
});

module.exports = router;
