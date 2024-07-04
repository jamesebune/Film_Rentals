const express = require("express");
const router = express.Router();
const { Users } = require("../models/users");
const mongoose = require("mongoose");
const _ = require("lodash");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
// router.get("/", async (req, res) => {
//   const users = await Users.find().sort("name");
//   res.send(users);
// });

// router.get("/:id", async (req, res) => {
//   const users = await Users.findById(req.params.id);
//   if (!users)
//     return res.status(404).res, send("user with specified ID does not exist");
//   res.send(users);
// });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if user already registered
  let users = await Users.findOne({ email: req.body.email });
  if (!users) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, users.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = users.generateAuthToken();
  res.send(token);
});

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(404).send(error.details[0].message);
//   const { id } = req.params;
//   const { name, email, password } = req.body;
//   const users = await Users.findByIdAndUpdate(
//     id,
//     { name, email, password },
//     { new: true }
//   );
//   if (!users)
//     //res.send(req.params.id);
//     return res.status(404).send("user with the given ID does not exist");

//   res.send(users);
// });
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   const users = await Users.findByIdAndDelete(id);
//   if (!users)
//     return res.status(404).send("User with the given ID does not exist");
//   res.send(user);
// });

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}
module.exports = router;
