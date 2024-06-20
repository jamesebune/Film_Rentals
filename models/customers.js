const express = require("express");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { boolean, required, custom } = require("joi");
const { type, max } = require("@hapi/joi/lib/types/object");

const vidlyCustomerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    max_length: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    max_length: 11,
  },
});
const Customer = mongoose.model("Customer", vidlyCustomerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(11).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
