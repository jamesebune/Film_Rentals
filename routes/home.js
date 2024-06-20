const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to Vidly film rental services");
});

module.exports = router;
