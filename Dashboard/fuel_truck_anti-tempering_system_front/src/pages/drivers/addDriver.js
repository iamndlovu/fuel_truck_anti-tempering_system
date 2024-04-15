
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

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpg";
import { useState } from "react";
import {Routes,Route,Link,useNavigate} from 'react-router-dom';

function Cover() {
  const navigate = useNavigate();
  const [id, setId] = useState("")

  const [name, setName] = useState("")

  const [phone,setPhone] = useState("")


  


  const handleSubmit = (evt) => {
      evt.preventDefault();
      axios.post('/driver', {
          id : id,
          name: name,
          phone : phone
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
              <MDInput type="text" name={id} onChange={e => setId(e.target.value)} label="driver Id" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" name={name} onChange={e => setName(e.target.value)} label="driver name" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" name={phone} onChange={e => setPhone(e.target.value)} label="driver phone number" variant="standard" fullWidth />
            </MDBox>
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

export default Cover;
