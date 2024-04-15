const mongoose = require('mongoose');

const DriverSchema = mongoose.Schema({
    id:{type: String, required: true,unique:true},
    name: {type:String, required: true} ,
    phone:{type: String,required: true, },
});

module.exports = mongoose.model('Drivers', DriverSchema);