const { Rental, validate } = require("../models/rental");
const { movies, Movies } = require("../models/movies");
const { Customer } = require("../models/customers");
const mongoose = require("mongoose");
const express = require("express");
const { route } = require("./genre");
const router = express.Router();
var Fawn = require("fawn"); //transaction

//Fawn.init(mongoose);
Fawn.init("mongodb://localhost:27017/VidlyDB");
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movies.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not available");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  //   rental = await rental.save();

  //   movie.numberInStock--;
  //   movie.save();
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed");
  }
});

module.exports = router;
