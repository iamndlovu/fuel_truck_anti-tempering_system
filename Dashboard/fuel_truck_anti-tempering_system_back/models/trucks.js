const mongoose = require('mongoose');

const TruckSchema = mongoose.Schema({
  plateNo: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  driver: { type: String },
  level: { type: Number, default: 0.0 },
  valve: { type: Boolean, default: 0.0 },
  pressure: { type: Number, default: 0.0 },
  weight: { type: Number, default: 0.0 },
  gps: {
    type: Object,
    default: {
      longitude: 0.000000000,
      latitude: 0.0000000000,
    },
  },
  setWeight: { type: Number, default: 0.0 },
});

module.exports = mongoose.model('Truck', TruckSchema);
