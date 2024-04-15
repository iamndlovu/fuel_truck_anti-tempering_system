const express = require('express');
const router = express.Router();
const jobs = require("../models/jobs")

router.post('/',(req,res)=>{
    var data = req.body
    var company = data.company;
    var goods = data.goods
    var jobNo = data.jobNo
    // var driver = data.driver
    var driverId = data.driverId
    var status = data.status
    var weight = data.weight
    // console.log(name)
    if(company==''|| goods==''|| jobNo==''||driverId==''||status==''||weight==''){
        console.log("missing field")
        res.status(403).send({message:"missing field"})
      }else{
        var jobsData = new jobs({
            jobNo ,company,goods,weight,status,driverId
        })
        jobsData.save();
        res.status(200).send({"message":"done"})
      }
})

router.get('/',(req,res)=>{
  jobs.find().exec().then(_res=>{
    console.log(_res)
    res.status(200).send({jobs:_res})
  })
})

router.get('/manage',(req,res)=>{
  var data = req.query
  var id = data.id
  console.log(id)
  jobs.find({jobNo:id}).then(_res=>{
    console.log(_res)
    res.status(200).send({message:"done",job: _res[0]})
  })
})

module.exports = router;