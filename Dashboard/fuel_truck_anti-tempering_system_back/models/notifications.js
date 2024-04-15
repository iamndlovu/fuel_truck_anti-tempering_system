const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    jobNo:{type: String, required: true},
    notification:{type: String, required: true},
});

module.exports = mongoose.model('Notifications', notificationSchema);