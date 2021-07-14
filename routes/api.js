const express = require("express");
const { LoginId } = require("@loginid/node-sdk");
const { validateJWt } = require("../middleware/user");

const webId = process.env.WEB_CLIENT_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const baseUrl = process.env.BASE_URL;

const loginid = new LoginId(webId, privateKey, baseUrl);

const router = express.Router();

router.post("/tx/create", validateJWt, async (req, res) => {
  const { tx_payload: txPayload } = req.body;
  const { username } = req.session;

  if (!txPayload) {
    return res.status(422).json({ message: "No payload received" });
  }

  try {
    const result = await loginid.createTx(txPayload, username);
    return res.status(201).json({ id: result });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
});

router.post("/tx/verify", validateJWt, async (req, res) => {
  const { jwt } = req.body;
  const { username } = req.session;

  if (!jwt) {
    return res.status(422).json({ message: "No jwt received" });
  }

  try {
    const result = await loginid.verifyToken(jwt, username);
    return res.status(201).json({ isValid: result });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
});

module.exports = router;
