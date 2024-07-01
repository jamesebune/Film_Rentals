const express = require("express");
const router = express.Router();
const { Users, validate } = require("../models/users");
const mongoose = require("mongoose");
const _ = require("lodash");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
router.get("/", async (req, res) => {
  const users = await Users.find().sort("name");
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const users = await Users.findById(req.params.id);
  if (!users)
    return res.status(404).res, send("user with specified ID does not exist");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if user already registered
  let users = await Users.findOne({ email: req.body.email });
  if (users) return res.status(400).send("User already registered");

  //   users = new Users({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password,
  //     //   password: passwordComplexity().validate(req.body.password),
  //   });
  users = new Users(_.pick(req.body, ["name", "email", "password"]));

  //using bcrypt to hash the user password
  const salt = await bcrypt.genSalt(10);
  users.password = await bcrypt.hash(users.password, salt);
  users = await users.save();
  res.send(_.pick(users, ["_id", "name", "email"]));
  //   res.send(users);
  //   res.send({
  //     name: users.name,
  //     email: users.email,
  //   });
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const { id } = req.params;
  const { name, email, password } = req.body;
  const users = await Users.findByIdAndUpdate(
    id,
    { name, email, password },
    { new: true }
  );
  if (!users)
    //res.send(req.params.id);
    return res.status(404).send("user with the given ID does not exist");

  res.send(users);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const users = await Users.findByIdAndDelete(id);
  if (!users)
    return res.status(404).send("User with the given ID does not exist");
  res.send(user);
});

module.exports = router;
