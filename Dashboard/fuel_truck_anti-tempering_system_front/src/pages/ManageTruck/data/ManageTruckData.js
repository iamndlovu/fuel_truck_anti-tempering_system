import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import axios from '../../../axiosInstance';
import mqtt from 'mqtt';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GaugeChart from 'react-gauge-chart';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Icon from '@mui/material/Icon';
import truckImg from 'assets/images/truck.jpg';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAvatar from 'components/MDAvatar';

const bull = (
  <Box
    component='span'
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

// const fuel = (

//   );

export default function OutlinedCard() {
  var options = {
    host: '192.168.137.1',
    port: 9001,
    protocol: 'websockets',
    username: '',
    password: '',
  };

  const [client, setClient] = useState(null);
  const [truckData, setTruckData] = useState([]);

  // const [longitude, setLongitude] = useState("0");
  // const [latitude, setLatitude] = useState("0");
  // const [fuel, setFuel] = useState(0.1);

  // const [time, setTime] = useState("0");

  const navigate = useNavigate();
  const { state } = useLocation();
  const truckId = state.truckId;

  //var task;
  // if(state.job){
  //   task =  state.job
  // }
  //state.job ? (task = state.job) : '';

  // console.log('task is')
  // console.log(task)

  const url = '/truck/manage?id=' + truckId;
  console.log(url);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchTruckData = async() => {
      try {
        const res = await axios.get(url);
        const fetchedTruckData = await res.data.truck;
        isMounted && setTruckData(fetchedTruckData);
      } catch(err) {
        console.log(`Component \'ManageTruck.js\' failed to fetch truck data with the following error:\n${err}`);
      }
    };
    fetchTruckData();
    const fetchTruckDataPeriodically = setInterval(() => fetchTruckData(),5500);

    /*axios
      .get(url)
      .then((response) => {
        console.log('no error');
        console.log(response.data.truck);

        isMounted && setTruckData(response.data.truck);
        console.log('truck');
        console.log(truckData);
      })
      .catch((err) => {
        console.log('error');
        console.log(err);
      });*/
    return () => {
      clearInterval(fetchTruckDataPeriodically);
      isMounted = false;
      controller.abort(); //cancel any pending requests when the component unmounts
    };
  }, []);
/*
  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        console.log('disconnected');
      });
    }
  };

  useEffect(() => {
    setClient(mqtt.connect(options));
  }, []);
  useEffect(() => {
    if (client) {
      console.log(client);
      client.on('connect', () => {
        console.log('connected');
        client.subscribe('truck/gps');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {});
      client.on('message', (topic, message) => {
        //   const payload = { topic, message: message.toString() };
        //   setPayload(payload);
        var top = topic.toString();
        var mess = JSON.parse(message);

        if (top == 'truck/gps') {
          console.log(mess);
          //setLatitude(mess.latitude);
          //setLongitude(mess.longitude);
          //   setpanicTime(mess.time)
          //   setpanicId(mess.device_id)
        }
      });
    }
    console.log('running');
    return () => {
      mqttDisconnect();
    };
  }, [client]);
*/
  let { level, valve, pressure, weight, gps, setWeight } = truckData;
  if (!gps)
    gps = {
      longitude: 0,
      latitude: 0,
    };
  const { longitude, latitude } = gps;
  const maplink = `http://maps.google.com/?q= +${latitude},${longitude}`;

  return (
    <>
      {/* <button onClick={decreaseFuel}>--</button>
    <button onClick={increaseFuel}>+</button> */}
      <Grid container spacing={3} alignItems='center'>
        <Grid item>
          <MDAvatar src={truckImg} alt='profile-image' size='xl' shadow='sm' />
        </Grid>
        <Grid item>
          <MDBox height='100%' mt={0.5} lineHeight={1}>
            <MDTypography variant='h5' fontWeight='medium'>
              {truckData.make}
            </MDTypography>
            <MDTypography variant='button' color='text' fontWeight='regular'>
              {truckData.plateNo}
            </MDTypography>
            <br></br>
            <MDTypography variant='button' color='text' fontWeight='regular'>
              {truckData.driver ? (
                truckData.driver
              ) : (
                <b>
                  <CardActions>
                    driver not assigned
                    <Button
                      onClick={() =>
                        navigate('/assigndriver', {
                          state: { truckId: truckData.plateNo },
                        })
                      }
                      size='small'
                    >
                      assign driver
                    </Button>
                  </CardActions>
                </b>
              )}
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>

      <Box
        sx={{
          minWidth: 275,
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        <Card
          variant='outlined'
          sx={{ minWidth: 345, backgroundColor: '#222222', marginTop: '40px' }}
        >
          <React.Fragment>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color='#9ABDDC' gutterBottom>
                level
              </Typography>
              <GaugeChart
                id='gauge-chart3'
                nrOfLevels={10}
                arcPadding={0.1}
                cornerRadius={3}
                colors={['#c30010', '#F5CD19', '#00FF00']}
                percent={level}
                textColor='#9ABDDC'
              />
            </CardContent>
            <CardActions>
              <Button size='small'>take action</Button>
            </CardActions>
          </React.Fragment>
        </Card>
        <Card
          variant='outlined'
          sx={{ minWidth: 345, backgroundColor: '#222222', marginTop: '40px' }}
        >
          <React.Fragment>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color='#9ABDDC' gutterBottom>
                weight of goods
              </Typography>
              <Typography
                variant='h5'
                component='div'
                sx={{ color: '#00FFDD' }}
              >
                SET
              </Typography>
              <Typography
                variant='h1'
                component='div'
                sx={{ color: '#00FF77', fontSize: 50, display: 'block' }}
              >
                {setWeight}
                <span style={{ fontSize: 25, color: '#00FF77' }}>kg</span>
              </Typography>
              <Typography variant='h5' component='div'>
                CURRENT
              </Typography>
              <Typography
                variant='h1'
                component='div'
                sx={{ fontSize: 100, display: 'block' }}
              >
                {weight}
                <span style={{ fontSize: 50, color: '#4169e1' }}>kg</span>
              </Typography>
            </CardContent>
            <CardActions>
              {/* <Button size="small">take action</Button> */}
            </CardActions>
          </React.Fragment>
        </Card>
        <Card
          variant='outlined'
          sx={{ minWidth: 400, backgroundColor: '#222222', marginTop: '40px' }}
        >
          <React.Fragment>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color='#9ABDDC' gutterBottom>
                location
              </Typography>
              <Typography variant='h5' component='div'>
                <span style={{fontFamily: '\'Courier New\', Courier, monospace'}}>Latitude&nbsp;:&nbsp;&nbsp;{latitude}</span>
              </Typography>
              <Typography variant='h5' component='div'>
                <span style={{fontFamily: '\'Courier New\', Courier, monospace'}}>Longitude:&nbsp;&nbsp;{longitude}</span> 
              </Typography>
            </CardContent>
            <CardActions>
              <Button size='small'>
                <a href={maplink} target='_blank'>
                  view on map
                </a>
              </Button>
            </CardActions>
          </React.Fragment>
        </Card>

        <Card
          variant='outlined'
          sx={{ minWidth: 400, backgroundColor: '#222222', marginTop: '40px' }}
        >
          <React.Fragment>
            <CardContent>
              <Typography variant='h5' component='div'>
                <span style={{fontFamily: '\'Courier New\', Courier, monospace'}}>Pressure:&nbsp;&nbsp;&nbsp;&nbsp;{pressure}</span>
              </Typography>
              <Typography variant='h5' component='div'>
                <span style={{fontFamily: '\'Courier New\', Courier, monospace'}}>Valve&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{valve ? 'Open' : 'Closed'}</span>
              </Typography>
            </CardContent>
          </React.Fragment>
        </Card>
      </Box>
    </>
  );
}
