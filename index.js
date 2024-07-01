//Service for managing a list of genres
//create.update and delete a genres
// const Joi = require("joi");
// const debug = require("debug")("app:startup");
const express = require("express");
const app = express();
const customers = require("./routes/customers");
const genres = require("./routes/genre");
const home = require("./routes/home");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const { required } = require("joi");
const { type } = require("@hapi/joi/lib/types/object");
const bodyParser = require("body-parser");

//Importing mongoose
const mongoose = require("mongoose");
//Database connection
mongoose
  .connect("mongodb://localhost:27017/VidlyDB") // mongodb://localhost:27017/
  .then(() => console.log("Connection to Mongo Database was successful"))
  .catch((err) => {
    console.log("Error connecting to Database", err.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/api/customers", customers);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/", home);
// how to know your current environment
//console.log(`NODE_ENV: ${process.env.node_env}`);
//console.log(`app: ${app.get("env")}`);

//Creating a webserver
app.get("/", (req, res) => {
  res.send("Welcome to Vidly film rental services");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}....`));
