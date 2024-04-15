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
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import axios from "../../axiosInstance";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

function Overview() {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({});
  const [truckId, setTruckid] = useState("");
  const { state } = useLocation();
  const jobNo = state.jobNo;
  // const url = "/job/manage?id"
  console.log();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    axios
      .get("/job/manage?id=" + jobNo)
      .then((response) => {
        console.log("no error");
        console.log(response.data.job);

        isMounted && setJobData(response.data.job);
        console.log("truck");
        console.log(jobData);
        axios
          .get("/truck/fetchtruck?id=" + response.data.job.driverId)
          .then((response) => {
            console.log("no error");
            console.log(response.data.truck);

            isMounted && setTruckid(response.data.truck.plateNo);
            console.log("truck id id");
            console.log(truckId);
          })
          .catch((err) => {
            console.log("error");
            console.log(err);
          });
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
    return () => {
      isMounted = false;
      controller.abort(); //cancel any pending requests when the component unmounts
    };
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <MDBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Job Information"
              description="__________________________________________________________________________________________________________________________"
              info={{
                Company: jobData.company,
                JobNo: jobData.jobNo,
                goods: jobData.goods,
                DriverId: jobData.driverId,
                Status: jobData.status,
              }}
              social={[
                {
                  link: "https://www.facebook.com/CreativeTim/",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/creativetim",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/creativetimofficial/",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              action={{ route: "/jobs", tooltip: "Edit Profile" }}
              shadow={false}
            />

            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
          <Button
            onClick={() =>
              navigate("/managetruck", {
                state: { truckId: truckId, job: jobData },
              })
            }
          >
            Manage shipping truc
          </Button>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Overview;
