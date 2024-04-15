
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
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpg";
import { useState, useEffect } from "react";
import {Routes,Route,Link,useNavigate,useLocation} from 'react-router-dom';

function Cover() {
  const navigate = useNavigate();
  const {state} = useLocation()
  const truckId = state.truckId
  const [driverData, setDriverData] = useState([])
  const [driver, setDriver] = useState("")
  

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
      console.log('driver ngu')
      console.log(driver)
      axios.post('/truck/updatedriver', {
          plateNo : truckId,
          driver:driver
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
          <TextField
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue="EUR"
          helperText="Please select driver"
          name={driver}
          onChange={e => setDriver(e.target.value)}
        >
          {driverData.map((option) => (
            <MenuItem key={option.id} value={option.id} >
              {option.id} 
            </MenuItem>
          ))}
        </TextField>
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

export default Cover;
