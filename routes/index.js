const express = require("express");
const { validateJWt } = require("../middleware/user");

const router = express.Router();

router.get("/", (_, res) => {
  return res.render("auth");
});

router.get("/dashboard", validateJWt, (req, res) => {
  return res.render("dashboard", { user: req.session.user });
});

module.exports = router;
