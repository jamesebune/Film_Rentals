const express = require("express");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const vidlySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    max_length: 50,
  },
});
const Genres = mongoose.model("Genres", vidlySchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

exports.Genres = Genres;
exports.validate = validateGenre;
