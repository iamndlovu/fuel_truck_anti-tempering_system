const express = require('express');
const router = express.Router();
const trucks = require('../models/trucks');

router.post('/', (req, res) => {
  const { plateNo, make, level, valve, pressure, weight, gps, setWeight } =
    req.body;

  let truckData = new trucks({
    plateNo,
    make,
  });

  if (level) truckData.level = level;
  if (valve) truckData.valve = valve;
  if (pressure) truckData.pressure = pressure;
  if (weight) truckData.weight = weight;
  if (setWeight) truckData.setWeight = setWeight;
  if (gps) truckData.gps = gps;

  truckData
    .save()
    .then(() => res.status(200).send({ message: 'done' }))
    .catch((err) => {
      console.log(`Error while saving ${plateNo}:\n\t${err}`);
      res
        .status(400)
        .send({ message: `Error while saving ${plateNo}:\n\t${err}` });
    });
});

router.post('/update/tank/:id', (req, res) => {
  trucks
    .findById(req.params.id)
    .then((truck) => {
      truck.level = req.body.level || truck.level;
      req.body.hasOwnProperty('valve')
        ? (truck.valve = req.body.valve)
        : (truck.valve = truck.valve);
      truck.pressure = req.body.pressure || truck.pressure;
      truck.weight = req.body.weight || truck.weight;
      truck.gps = req.body.gps || truck.gps;
      truck.setWeight = req.body.setWeight || truck.setWeight;
      truck
        .save()
        .then(() => res.json('truck updated'))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post('/updatedriver', (req, res) => {
  const { plateNo, driver } = req.body;

  if (plateNo == '' || driver == '') {
    console.log('missing field');
    res.status(403).send({ message: 'missing field' });
  } else {
    trucks.findOne({ plateNo: plateNo }, (err, _truck) => {
      if (err) {
        console.log(err);
        res.status(505).send({ message: 'server error' });
      } else {
        _truck.driver = driver;
        _truck
          .save()
          .then(() => res.status(200).send({ message: 'done' }))
          .catch((e) => {
            console.log(e);
            res.status(505).send({ message: 'server error' });
          });
      }
    });
  }
});

router.get('/manage', (req, res) => {
  const { id } = req.query;
  trucks
    .findOne({ plateNo: id })
    .then((_res) => {
      res.status(200).send({ message: 'done', truck: _res });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send({ message: err, truck: null });
    });
});

router.get('/', (req, res) => {
  trucks
    .find()
    .exec()
    .then((_res) => {
      res.status(200).send({ trucks: _res });
    });
});

router.get('/fetchtruck', (req, res) => {
  const { id } = req.query;
  try {
    trucks.findOne({ driver: id }).then((_res) => {
      res.status(200).send({ message: 'done', truck: _res });
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err, truck: null });
  }
});

module.exports = router;
