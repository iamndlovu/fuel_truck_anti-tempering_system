var express = require("express");
var app = express();
var mongoose = require("mongoose");
const body_parser = require("body-parser");
const cors = require("cors");

var user = require("./routes/users");
var truck = require("./routes/trucks");
var job = require("./routes/jobs");
var driver = require("./routes/drivers");
var notification = require("./routes/notifications");

const corsOption = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOption));
//if you want in every domain then
app.use(cors());

app.use(body_parser.json());

var db_url = "mongodb://0.0.0.0:27017/jubDeliveries";

mongoose.set("strictQuery", true);
mongoose.connect(db_url);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("DB Connected"));

app.listen(1999, (req, res) => {
  console.log("Server running on port 1999");
});

app.use("/user", user);
app.use("/truck", truck);
app.use("/job", job);
app.use("/driver", driver);
app.use("/notification", notification);
