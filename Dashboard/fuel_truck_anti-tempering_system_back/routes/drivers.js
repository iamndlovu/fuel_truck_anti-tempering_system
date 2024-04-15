const express = require('express');
const router = express.Router();
const drivers = require("../models/drivers")


router.get('/',(req,res)=>{
  
  drivers.find().exec()
  .then(_drivers=>{
    console.log(_drivers)
    res.status(200).send({drivers:_drivers})
  })
})




router.post('/',async (req,res)=>{
    var data = req.body
    var id = data.id;
    var name = data.name
    var phone = data.phone
   
    if(id==''|| name=='' || phone ==''){
        console.log("missing field")
        res.status(403).send({message:"missing field"})
  }else{
  var not_unique = await drivers.findOne({id:id})
  console.log("unique is")
  console.log(not_unique)
  if(not_unique){
    console.log("driver already exists")
    res.status(401).send({message:"user already exists"})
  }else{
    var driverData = new drivers({
        id,name,phone
    })

    driverData.save()
    res.status(200).send({"message":"done"})
  }

} 
})



module.exports = router;