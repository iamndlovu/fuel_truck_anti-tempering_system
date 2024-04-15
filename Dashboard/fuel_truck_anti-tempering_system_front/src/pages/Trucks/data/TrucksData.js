import { useState, useEffect } from "react";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "../../../axiosInstance";

// Images
import team2 from "assets/images/truck.jpg";

export default function data() {
  const navigate = useNavigate();
  const [truckData, setTruckData] = useState([]);

  function nav(id) {
    console.log("hererer");
    navigate("/managetruck", { state: { truckId: id } });
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    axios
      .get("/truck")
      .then((response) => {
        console.log("no error");
        // console.log(response.data.trucks);

        isMounted && setTruckData(response.data.trucks);
        console.log("truck");
        console.log(truckData);
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      {truckData.map((truck) => (
        <Card sx={{ maxWidth: 345, flexWrap: "wrap", marginTop: "40px" }}>
          <CardActionArea>
            <CardMedia
              component="img"
              width="100%"
              image={team2}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {truck.make}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {truck.plateNo}
                <p>
                  <b>Driver </b>
                  <span>
                    {" "}
                    :{truck.driver ? truck.driver : <p>not assigned</p>}
                  </span>
                </p>
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => nav(truck.plateNo)}
            >
              manage
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
