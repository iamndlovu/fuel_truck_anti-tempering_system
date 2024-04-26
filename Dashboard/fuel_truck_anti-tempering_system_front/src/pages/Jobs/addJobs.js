// react-router-dom components
import axios from '../../axiosInstance';
// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

// Authentication layout components
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// Images
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddJobs() {
  const navigate = useNavigate();

  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('');
  const [jobNo, setjobNo] = useState('');
  const [driverData, setDriverData] = useState([]);
  const [driverId, setDriverId] = useState('');
  const [goods, setGoods] = useState('');
  const [weight, setWeight] = useState('');
  const [level, setLevel] = useState('');
  const [pressure, setPressure] = useState('');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    axios
      .get('/driver')
      .then((response) => {
        console.log('no error');
        console.log(response.data.drivers);

        isMounted && setDriverData(response.data.drivers);
        console.log('driver');
        console.log(driverData);
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

  const handleSubmit = (evt) => {
    evt.preventDefault();
    axios
      .post('/job', {
        company,
        status,
        jobNo,
        driverId,
        goods,
        weight,
        level,
        pressure,
      })
      .then(function (response) {
        console.log(response);
        if (response.data) {
          alert(response?.data?.message);
        }
      })
      .catch(function (err) {
        console.log(err);
        if (!err?.response) {
          alert('No Server Response');
        } else if (err.response?.status) {
          alert(err.response?.data?.message);
        }
      });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox pt={4} pb={4} px={3}>
          <MDBox component='form' role='sform'>
            <MDBox mb={2}>
              <MDInput
                type='text'
                name={company}
                onChange={(e) => setCompany(e.target.value)}
                label='company'
                variant='standard'
                fullWidth
              />
            </MDBox>
            <TextField
              id='outlined-select-currency'
              select
              label='Select'
              defaultValue='EUR'
              helperText='Please select status'
              name={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value='not complete'>not complete</MenuItem>
              <MenuItem value='complete'>complete</MenuItem>
            </TextField>

            <MDBox mb={2}>
              <MDInput
                type='text'
                name={goods}
                onChange={(e) => setGoods(e.target.value)}
                label='Goods'
                variant='standard'
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='text'
                name={weight}
                onChange={(e) => setWeight(e.target.value)}
                label='Weigth of goods (kg)'
                variant='standard'
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='text'
                name={level}
                onChange={(e) => setLevel(e.target.value)}
                label='Tank level (%)'
                variant='standard'
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='text'
                name={pressure}
                onChange={(e) => setPressure(e.target.value)}
                label='Tank pressure (bar)'
                variant='standard'
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type='text'
                name={jobNo}
                onChange={(e) => setjobNo(e.target.value)}
                label='Job No'
                variant='standard'
                fullWidth
              />
            </MDBox>
            <TextField
              id='outlined-select-currency'
              select
              label='Select'
              defaultValue='EUR'
              helperText='Please select driver'
              name={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              {driverData.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name} ({option.id} )
                </MenuItem>
              ))}
            </TextField>

            <MDBox display='flex' alignItems='center' ml={-1}></MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={handleSubmit}
                variant='gradient'
                color='info'
                fullWidth
              >
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
