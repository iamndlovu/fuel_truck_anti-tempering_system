const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    jobNo:{type: String, required: true},
    company:{type: String, required: true},
    goods: {type:String, required: true} ,
    weight: {type:String, required: true},
    status:{type: String,required: true},
    driverId:{type:String},
});

module.exports = mongoose.model('Jobs', JobSchema);