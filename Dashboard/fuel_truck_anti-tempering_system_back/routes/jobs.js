const express = require('express');
const router = express.Router();
const jobs = require('../models/jobs');
const trucks = require('../models/trucks');

router.post('/', (req, res) => {
  const { company, goods, jobNo, driverId, status, weight, pressure, level } =
    req.body;
  if (status.toLowerCase() == 'not complete') {
    trucks.findOne({ driver: driverId }).then((truck) => {
      truck.setWeight = weight;
      truck.setLevel = level;
      truck.setPressure = pressure;
      truck.jobComplete = false;
      truck.save();
    });
  }
  if (
    company == '' ||
    goods == '' ||
    jobNo == '' ||
    driverId == '' ||
    status == '' ||
    weight == ''
  ) {
    console.log('missing field');
    res.status(403).send({ message: 'missing field' });
  } else {
    const jobsData = new jobs({
      jobNo,
      company,
      goods,
      weight,
      status,
      driverId,
    });
    jobsData.save();
    res.status(200).send({ message: 'done' });
  }
});

router.get('/', (req, res) => {
  jobs
    .find()
    .exec()
    .then((_res) => {
      res.status(200).send({ jobs: _res });
    });
});

router.get('/manage', (req, res) => {
  const { id } = req.query;
  jobs.find({ jobNo: id }).then((_res) => {
    console.log(_res);
    res.status(200).send({ message: 'done', job: _res[0] });
  });
});

module.exports = router;
