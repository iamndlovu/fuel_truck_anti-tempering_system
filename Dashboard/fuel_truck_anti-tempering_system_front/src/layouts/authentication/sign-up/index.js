
// react-router-dom components
import axios from '../../../axiosInstance';
// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";


// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpg";
import { useState } from "react";
import {Routes,Route,Link,useNavigate} from 'react-router-dom';

function Cover() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")

  const [name, setName] = useState("")

  const [password, setPassword] = useState("")

  const [phone, setPhone] = useState("")


  const handleSubmit = (evt) => {
      evt.preventDefault();
      axios.post('/user/signup', {
          name : name,
          email: email,
          password: password,
          phone:"000000"
        })
        .then(function (response) {
          console.log(response);
          if(response.data){
            // setEmail('');
            // setPassword('');
            alert(response?.data?.message)
            navigate('/authentication/sign-in');
          }else{
            alert('check your username and password')
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
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Monitor your truck today
          </MDTypography>
          <MDTypography display="block"  variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={4} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="text" name={name} onChange={e => setName(e.target.value)} label="Name" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="email" name={email} onChange={e => setEmail(e.target.value)} label="Email" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" name={password} onChange={e => setPassword(e.target.value)} label="Password" variant="standard" fullWidth />
            </MDBox>
            

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton onClick={handleSubmit} variant="gradient" color="info" fullWidth>
                sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign in
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
