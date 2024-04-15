import {useState, useEffect} from 'react';

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import axios from "../../../axiosInstance"

// Images
import team2 from "assets/images/truck.jpg";


export default function data() {
    
    
    const [truckData, setTruckData] = useState([])

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
    
        axios.get('/truck')
        .then(response=>{
            console.log("no error")
            console.log(response.data);
            isMounted && dat(response.data.trucks);
            

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
  const TruckNo = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );
const dat = (trucks)=>{
    var values =[]
    trucks?.length? 
    trucks.map((truck)=>{
       values.push(      {
        truckNo: <TruckNo image={team2} name={truck.truckNo} email={truck.name} />,
        function: <Job title={truck.jobNo} description={truck.job} />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        assigned: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            assigned
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="secondary" fontWeight="large">
            Manage
          </MDTypography>
        ),
        })
    }) : ""

    console.log(values)
    setTruckData(values)
}
  return {
    columns: [
      { Header: "truckNo", accessor: "truckNo", width: "45%", align: "left" },
      { Header: "function", accessor: "function", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "assigned", accessor: "assigned", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: truckData
  };
}
