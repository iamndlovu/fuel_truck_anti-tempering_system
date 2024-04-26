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

import { useState, useEffect } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import MDSnackbar from 'components/MDSnackbar';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import axios from '../../axiosInstance';

function Notifications() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    axios
      .get('/notification')
      .then((response) => {
        isMounted && setNotifications(response.data.not);
        console.log(Notifications);
      })
      .catch((err) => {
        console.log('error');
        console.log(err);
      });
    return () => {
      isMounted = false;
      controller.abort(); //cancel any pending requests when the component unmounts
    };
  }, []);

  const alertContent = ({ time, location, truck, message }) => (
    <MDTypography variant='body2' color='white'>
      <h3>{message.toUpperCase()}</h3>
      <br />
      <b>Time:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {`${new Date(time).toLocaleString()}`}
      <br />
      <b>Location:</b>&nbsp;&nbsp;&nbsp;&nbsp;
      {`[latitude: ${location.latitude}, longitude: ${location.longitude}]`}
      <br />
      <b>Truck No:</b>&nbsp;&nbsp;&nbsp;{`${truck}`}
    </MDTypography>
  );

  const renderSuccessSB = (
    <MDSnackbar
      color='success'
      icon='check'
      title='Material Dashboard'
      content='Hello, world! This is a notification message'
      dateTime='11 mins ago'
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderInfoSB = (
    <MDSnackbar
      icon='notifications'
      title='Material Dashboard'
      content='Hello, world! This is a notification message'
      dateTime='11 mins ago'
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const renderWarningSB = (
    <MDSnackbar
      color='warning'
      icon='star'
      title='Material Dashboard'
      content='Hello, world! This is a notification message'
      dateTime='11 mins ago'
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color='error'
      icon='warning'
      title='Material Dashboard'
      content='Hello, world! This is a notification message'
      dateTime='11 mins ago'
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent='center'>
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant='h5'>notifications</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {notifications.map((value) => (
                  <MDAlert key={value.jobNo} color='error' dismissible>
                    {alertContent(value.notification)}
                  </MDAlert>
                ))}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
