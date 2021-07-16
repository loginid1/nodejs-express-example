const express = require("express");
const { validateJWt, setJwt } = require("../middleware/user");

const router = express.Router();

router.post("/register", validateJWt, setJwt, (_, res) => {
  return res.status(204).send("OK");
});

router.post("/login", validateJWt, setJwt, (_, res) => {
  return res.status(204).send("OK");
});

router.post("/logout", (req, res) => {
  res.clearCookie("authorization");
  req.session.user = {};
  return res.redirect("/");
});

module.exports = router;
