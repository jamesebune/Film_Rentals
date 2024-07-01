const express = require("express");
const router = express.Router();
const { Movies, validate } = require("../models/movies");
const { Genres } = require("../models/genreModel");
const { number } = require("joi");

router.get("/", async (req, res) => {
  const movies = await Movies.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movies = await Movies.findById(req.params.id);
  if (!movies)
    return (
      res.status(404).res, send("Customer with specified ID does not exist")
    );
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");
  let movies = new Movies({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movies = await movies.save();
  res.send(movies);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const { id } = req.params;
  const { title, genre, numberInStock, dailyRentalRate } = req.body;
  const movies = await Movies.findByIdAndUpdate(
    id,
    { title, genre, numberInStock, dailyRentalRate },
    { new: true }
  );
  if (!movies)
    //res.send(req.params.id);
    return res.status(404).send("Movie with the given ID does not exist");

  res.send(movies);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const movies = await Movies.findByIdAndDelete(id);
  if (!movies)
    return res.status(404).send("MOvie with the given ID does not exist");
  res.send(movies);
});

module.exports = router;
