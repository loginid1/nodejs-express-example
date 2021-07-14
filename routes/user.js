const express = require("express");
const { validateJWt, setJwt } = require("../middleware/user");

const router = express.Router();

router.post("/register", validateJWt, setJwt, (req, res) => {
  return res.render("dashboard", { user: req.session.user });
});

router.post("/login", validateJWt, setJwt, (req, res) => {
  return res.render("dashboard", { user: req.session.user });
});

router.post("/logout", (_, res) => {
  res.clearCookie("authorization");
  res.session.user = {};
  return res.redirect("/");
});

module.exports = router;
