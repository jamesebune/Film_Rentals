const express = require("express");
const router = express.Router();
const { Genres, validate } = require("../models/genreModel");

router.get("/", async (req, res) => {
  const genre = await Genres.find().sort("name");
  res.send(genre);
});
router.get("/:id", async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre)
    return res.status(404).send(`Film with the given Genre does not exist`);
  res.send(genre);
  // const genre = Genres.find((c) => c.id === parseInt(req.params.id));
  // if (!genre)
  //   return res.status(404).send(`Film with the given Genre does not exist`);
  // res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = new Genres({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

//update a record: PUT Method
router.put("/:id", async (req, res) => {
  // //Look up the genres
  // //If not existing, return 404
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));
  // if (!genre)
  //   return res.status(404).send(`Film with the given Genre does not exist`);
  // //validate
  // //if invalid, return 400-Bad request
  // const { error } = validateGenre(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  // //Update genre
  // genre.name = req.body.name;
  // //return the updated genre
  // res.send(genre);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genres.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("The genre with the given ID does not exist");
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  // //look up the genres  and return 404 if not existing
  // const genre = genres.find((c) => c.id === parseInt(req.params.id));
  // if (!genre)
  //   return res.status(404).send(`Film with the given Genre does not exist`);
  // //Delete genre
  // const indexOfGenre = genres.indexOf(genre);
  // genres.splice(indexOfGenre, 1);
  // //return the deleted genre
  // res.send(genre);
  const genre = Genres.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the ID does not exist");
  res.send(genre);
});

module.exports = router;
