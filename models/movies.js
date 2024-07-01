const express = require("express");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { type } = require("@hapi/joi/lib/types/object");
const { number, required, disallow } = require("joi");
const { genreSchema } = require("./genreModel");
const moviesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    max_length: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});
const Movies = mongoose.model("Movies", moviesSchema);

function validateMovies(movies) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(movies);
}

exports.Movies = Movies;
exports.validate = validateMovies;
