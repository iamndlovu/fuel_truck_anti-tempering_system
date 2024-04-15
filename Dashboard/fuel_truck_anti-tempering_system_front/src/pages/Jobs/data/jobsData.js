/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Icon from "@mui/material/Icon";
import {useState, useEffect} from 'react';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import axios from "../../../axiosInstance"

// Images
import logoJobs from "assets/images/jobs.png"
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import {Routes,Route,Link,useNavigate,useLocation} from 'react-router-dom';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function data() {
  const [jobData, setJobData] = useState([])


  const navigate = useNavigate()
  useEffect(()=>{
      let isMounted = true;
      const controller = new AbortController();
  
      axios.get('/job')
      .then(response=>{
          console.log("no error")
          console.log(response.data);
          isMounted && dat(response.data.jobs);
          

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

  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );
  const dat = (jobs)=>{
    var values =[]
    jobs?.length? 
    jobs.map((job)=>{
       values.push(    
        {
          Company: <Project image={logoJobs} name={job.company} />,
          goods: (
            <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
              {job.goods}
            </MDTypography>
          ),
          status: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {job.status}
            </MDTypography>
          ),
          Driver:  (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {job.driverId}
            </MDTypography>
          ),
          action: (
            <MDTypography  color="text">
                <Button onClick={()=>navigate('/managejob',{state:{jobNo:job.jobNo}})} >manage job</Button>
            </MDTypography>
          ),
        }  
  )
    }) : ""

    console.log(values)
    setJobData(values)
}
  return {
    columns: [
      { Header: "Company", accessor: "Company", width: "30%", align: "left" },
      { Header: "goods", accessor: "goods", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "Driver", accessor: "Driver", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: jobData
  };
}
