const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userName:{type: String, required: true},
    userPassword: {type:String, required: true} ,
    userEmail:{type: String,required: true, unique:true},
    userPhone:{type: String }
});

module.exports = mongoose.model('Users', UserSchema);