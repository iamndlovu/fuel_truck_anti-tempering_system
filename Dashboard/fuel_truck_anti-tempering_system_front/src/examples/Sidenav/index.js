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

import { useEffect, useState } from 'react';
import axios from '../../axiosInstance';

// react-router-dom components
import { useLocation, NavLink } from 'react-router-dom';

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

// @mui material components
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material Dashboard 2 React example components
import SidenavCollapse from 'examples/Sidenav/SidenavCollapse';

// Custom styles for the Sidenav
import SidenavRoot from 'examples/Sidenav/SidenavRoot';
import sidenavLogoLabel from 'examples/Sidenav/styles/sidenav';
import logo from '../../assets/images/logos/logo.png';

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from 'context';

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    sidenavColor,
  } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace('/', '');
  const [notificationsLength, setNotificationsLength] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchNotifications = async () => {
      const notificationRes = await axios.get('/notification');
      const notifications = notificationRes.data.not;
      setNotificationsLength(notifications.length);
      console.log(`Notifications length: ${notifications.length}`);
    };

    const fetchTrucks = async () => {
      try {
        console.log('fetching trucks...');
        const truckRes = await axios.get('/truck');
        const fetchedTrucks = await truckRes.data.trucks;
        console.log('number of trucks: ' + fetchedTrucks.length);
        return fetchedTrucks;
      } catch (err) {
        console.log(
          `Component \'App.js\' failed to fetch data with the following error:\n${err}`
        );
      }
    };

    fetchNotifications();
    fetchTrucks();

    const fetchNotificationsPeriodically = setInterval(
      () => fetchNotifications(),
      7000
    );
    const fetchTrucksPeriodically = setInterval(() => {
      fetchTrucks().then((data) => {
        data.forEach((truck) => {
          const {
            level,
            weight,
            pressure,
            valve,
            setLevel,
            setWeight,
            setPressure,
            jobComplete,
            weightCompromised,
            levelCompromised,
            pressureCompromised,
            valveCompromised,
            driver,
            _id,
            make,
          } = truck;
          console.log('checking...' + make);
          if (jobComplete == false) {
            console.log(make + ' has an incomplete job');
            if (setLevel - level > 10 && !levelCompromised) {
              const message = 'level decreased by ' + (setLevel - level) + '%';
              console.log(
                make + ' level decreased by ' + (setLevel - level) + '%'
              );
              console.log('adding notification....');
              axios
                .post('/truck/addAlert', { driver, _id, message })
                .then((res) => console.log(res.data));
            } else {
              console.log(make + ' level unchanged (or compromised)');
            }

            if (setPressure - pressure > 10 && !pressureCompromised) {
              const message =
                'pressure decreased by ' + (setPressure - pressure) + 'bar';
              console.log(
                make +
                  ' pressure decreased by ' +
                  (setPressure - pressure) +
                  'bar'
              );
              console.log('adding notification....');
              axios
                .post('/truck/addAlert', { driver, _id, message })
                .then((res) => console.log(res.data));
            } else {
              console.log(make + ' pressure unchanged');
            }

            if (setWeight - weight > 8 && !weightCompromised) {
              const message =
                'weight decreased by ' + (setWeight - weight) + 'kg';
              console.log(
                make + ' weight decreased by ' + (setWeight - weight) + 'kg'
              );
              console.log('adding notification....');
              axios
                .post('/truck/addAlert', { driver, _id, message })
                .then((res) => console.log(res.data));
            } else {
              console.log(make + ' weight unchanged');
            }

            if (valve && !valveCompromised) {
              const message = 'Valve opened!';
              console.log('adding notification....');
              axios
                .post('/truck/addAlert', { driver, _id, message })
                .then((res) => console.log(res.data));
            } else {
              console.log(make + ' valve CLOSED');
            }
          } else {
            console.log(make + ' has no incomplete jobs');
          }
        });
      });
    }, 10000);

    return () => {
      clearInterval(fetchNotificationsPeriodically);
      clearInterval(fetchTrucksPeriodically);
      isMounted = false;
      controller.abort(); //cancel any pending requests when the component unmounts
    };
  }, []);

  let textColor = 'white';

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = 'dark';
  } else if (whiteSidenav && darkMode) {
    textColor = 'inherit';
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : transparentSidenav
      );
      setWhiteSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : whiteSidenav
      );
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener('resize', handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, noCollapse, key, href, route }) => {
      let returnValue;

      if (type === 'collapse') {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target='_blank'
            rel='noreferrer'
            sx={{ textDecoration: 'none' }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
            />
          </NavLink>
        );
      } else if (type === 'title') {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display='block'
            variant='caption'
            fontWeight='bold'
            textTransform='uppercase'
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === 'divider') {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant='permanent'
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign='center'>
        <MDBox
          display={{ xs: 'block', xl: 'none' }}
          position='absolute'
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: 'pointer' }}
        >
          <MDTypography variant='h6' color='secondary'>
            <Icon sx={{ fontWeight: 'bold' }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to='/' display='flex' alignItems='center'>
          {brand && (
            <MDBox component='img' src={logo} alt='Brand' width='12rem' />
          )}
          <MDBox
            width={!brandName && '100%'}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            {/* <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography> */}
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
      {notificationsLength > 0 && (
        <div
          className='notification-circle-number'
          style={{
            position: 'fixed',
            bottom: '29.3%',
            left: '68%',
            color: 'aliceblue',
            fontSize: '0.9rem',
            fontWeight: 600,
            backgroundColor: 'red',
            lineHeight: 1,
            padding: '5px 7px',
            borderRadius: '3px',
            zIndex: -1,
          }}
        >
          {notificationsLength}
        </div>
      )}
      <MDBox p={2} mt='auto'></MDBox>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: 'info',
  brand: '',
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'dark',
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
