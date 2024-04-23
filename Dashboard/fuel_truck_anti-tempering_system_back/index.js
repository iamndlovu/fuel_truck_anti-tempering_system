const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const user = require('./routes/users');
const truck = require('./routes/trucks');
const job = require('./routes/jobs');
const driver = require('./routes/drivers');
const notification = require('./routes/notifications');

app.use(cors());

app.use(express.json());

const db_url = 'mongodb://0.0.0.0:27017/ftats';

mongoose.set('strictQuery', true);
mongoose.connect(db_url);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('DB Connected'));

app.listen(1999, (req, res) => {
  console.log('Server running on port 1999');
});

app.use('/user', user);
app.use('/truck', truck);
app.use('/job', job);
app.use('/driver', driver);
app.use('/notification', notification);
