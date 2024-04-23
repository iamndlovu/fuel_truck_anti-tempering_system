const express = require('express');
const router = express.Router();
const drivers = require('../models/drivers');

router.get('/', (req, res) => {
  drivers
    .find()
    .exec()
    .then((_drivers) => {
      res.status(200).send({ drivers: _drivers });
    });
});

router.post('/', async (req, res) => {
  const { id, name, phone } = req.body;

  if (id == '' || name == '' || phone == '') {
    res.status(403).send({ message: 'missing field' });
  } else {
    const not_unique = await drivers.findOne({ id: id });
    if (not_unique) {
      console.log('driver already exists');
      res.status(401).send({ message: 'user already exists' });
    } else {
      const driverData = new drivers({
        id,
        name,
        phone,
      });

      driverData.save();
      res.status(200).send({ message: 'done' });
    }
  }
});

module.exports = router;
