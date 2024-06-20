const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customers");

router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return (
      res.status(404).res, send("Customer with specified ID does not exist")
    );
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const { id } = req.params;
  const { isGold, name, phone } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    id,
    { isGold, name, phone },
    { new: true }
  );
  //res.send(req.params.id);
  if (!customer)
    //res.send(req.params.id);
    return res.status(404).send("Customer with the given ID does not exist");

  res.send(customer);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer)
    return res.status(404).send("Customer with the given ID does not exist");
  res.send(customer);
});

module.exports = router;
