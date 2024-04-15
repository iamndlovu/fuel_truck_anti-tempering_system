const express = require('express');
const router = express.Router();
const notificate = require("../models/notifications")


router.get('/',(req,res)=>{
  
  notificate.find().exec()
  .then(_not=>{
    console.log(_not)
    res.status(200).send({not:_not})
  })
})




router.post('/',async (req,res)=>{
    var data = req.body
    var jobNo = data.jobNo;
    var notification = data.notification

   
    if(jobNo==''|| notification==''){
        console.log("missing field")
        res.status(403).send({message:"missing field"})
  }else{
        var not = new notificate({
            jobNo,notification
        })

        not.save()
        res.status(200).send({message:'done'})

} 
})



module.exports = router;