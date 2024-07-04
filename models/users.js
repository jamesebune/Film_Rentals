//const Joi = require("@hapi/joi");
const Joi = require("joi");
const mongoose = require("mongoose");
const { type } = require("@hapi/joi/lib/types/object");
const { required } = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const passwordComplexity = require("joi-password-complexity");
const config = require("config");
const jwt = require("jsonwebtoken");

const complexityOptions = {
  min: 5,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});
userSchema.methods.generateAuthToken = function () {
  //How to generate a JWT
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Users = mongoose.model("Users", userSchema);

function validateUser(users) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: passwordComplexity(complexityOptions).required(),
    //isAdmin: Joi.string().required(),
    //   return Joi.validate(users, schema
  });
  return schema.validate(users);
}

exports.Users = Users;
exports.validate = validateUser;
exports.userSchema = userSchema;
