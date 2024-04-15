
// react-router-dom components
import axios from '../../axiosInstance';
// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";


import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpg";
import { useState, useEffect } from "react";
import {Routes,Route,Link,useNavigate,useLocation} from 'react-router-dom';

function AddJobs() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("")

  const [status, setStatus] = useState("")

  const [jobNo, setjobNo] = useState("")

  const [driverData, setDriverData] = useState([])

  const [driverId, setDriverId] = useState("")

  const [goods, setGoods] = useState("")

  const [weight,setWeight] = useState("")

  useEffect(()=>{
    let isMounted = true;
    const controller = new AbortController();

    axios.get('/driver')
    .then(response=>{
        console.log("no error")
        console.log(response.data.drivers);

        isMounted && setDriverData(response.data.drivers);
        console.log("driver")
        console.log(driverData)
        

    })
    .catch(err=>{
        console.log("error")
       console.log(err)
    })
  return ()=>{
      isMounted=false;
      controller.abort(); //cancel any pending requests when the component unmounts
  }
},[])
  


  const handleSubmit = (evt) => {
      evt.preventDefault();
      axios.post('/job', {
          company : company ,
          status: status,
          jobNo: jobNo,
          driverId: driverId,
          goods: goods,
          weight: weight
        })
        .then(function (response) {
          console.log(response);
          if(response.data){
            // setTruckNo('');
            // setPassword('');
            alert(response?.data?.message)
          }
        })
        .catch(function (err) {
          console.log(err);
          if(!err?.response){
            alert('No Server Response')
          }else if(err.response?.status){
            alert(err.response?.data?.message)
          }
     
        });
  }
  return (
    <DashboardLayout>
    <DashboardNavbar />
      <Card>
        <MDBox pt={4} pb={4} px={3}>
          <MDBox component="form" role="sform">
            <MDBox mb={2}>
              <MDInput type="text" name={company} onChange={e => setCompany(e.target.value)} label="company" variant="standard" fullWidth />
            </MDBox>
            <TextField
              id="outlined-select-currency"
              select
              label="Select"
              defaultValue="EUR"
              helperText="Please select status"
              name={status}
              onChange={e => setStatus(e.target.value)}
            >
                <MenuItem  value="not complete" >
                  not complete
                </MenuItem>
                <MenuItem  value="complete" >
                  complete
                </MenuItem>
        </TextField>

            <MDBox mb={2}>
              <MDInput type="text" name={goods} onChange={e => setGoods(e.target.value)} label="goods" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" name={weight} onChange={e => setWeight(e.target.value)} label="weigth of goods (kg)" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" name={jobNo} onChange={e => setjobNo(e.target.value)} label="Job No" variant="standard" fullWidth />
            </MDBox>
            <TextField
              id="outlined-select-currency"
              select
              label="Select"
              defaultValue="EUR"
              helperText="Please select driver"
              name={driverId}
              onChange={e => setDriverId(e.target.value)}
            >
              {driverData.map((option) => (
                <MenuItem key={option.id} value={option.id} >
                  {option.name} ({option.id} )
                </MenuItem>
              ))}
        </TextField>

            <MDBox display="flex" alignItems="center" ml={-1}>


            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton onClick={handleSubmit} variant="gradient" color="info" fullWidth>
                submit
              </MDButton>
            </MDBox>

          </MDBox>
        </MDBox>
      </Card>
      </DashboardLayout>
  );
}

export default AddJobs;
