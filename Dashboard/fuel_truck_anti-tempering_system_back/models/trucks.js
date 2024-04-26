const mongoose = require('mongoose');

const TruckSchema = mongoose.Schema({
  plateNo: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  driver: { type: String },
  level: { type: Number, default: 0.0 },
  valve: { type: Boolean, default: 0 },
  pressure: { type: Number, default: 0.0 },
  weight: { type: Number, default: 0.0 },
  compromised: { type: Boolean, default: 0 },
  jobComplete: { type: Boolean, default: 1 },
  gps: {
    type: Object,
    default: {
      longitude: 0.0,
      latitude: 0.0,
    },
  },
  setWeight: { type: Number, default: 0.0 },
  setLevel: { type: Number, default: 0.0 },
  setPressure: { type: Number, default: 0.0 },
});

module.exports = mongoose.model('Truck', TruckSchema);
