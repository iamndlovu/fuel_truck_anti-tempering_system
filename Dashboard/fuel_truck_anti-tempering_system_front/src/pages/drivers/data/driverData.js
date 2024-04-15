import {useState, useEffect} from 'react';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import axios from "../../../axiosInstance"

// Images
import team2 from "assets/images/user.png";


export default function data() {
    
    
    const [driverData, setDriverData] = useState([])

    useEffect(()=>{
        let isMounted = true;
        const controller = new AbortController();
    
        axios.get('/driver')
        .then(response=>{
            console.log("no error")
            // console.log(response.data.trucks);

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

  return (
    <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap'}}>
      {
        driverData.map((driver)=>
        <Card sx={{ maxWidth: 345,marginTop:'40px'}} >
        <CardActionArea>
          <CardMedia
            component="img"
            width="100%"
            image={team2}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {driver.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
               {driver.id}
               {driver.phone}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" >
            <a href='/managedriver'>
            manage
            </a>
            
          </Button>
        </CardActions>
      </Card>
        )
      }

    </div>
  )
    }
