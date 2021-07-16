const express = require("express");
const { LoginId, LoginIdManagement } = require("@loginid/node-sdk");
const { validateJWt } = require("../middleware/user");

const webId = process.env.WEB_CLIENT_ID;
const managementId = process.env.MANAGEMENT_CLIENT_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const baseUrl = process.env.BASE_URL;

const loginid = new LoginId(webId, privateKey, baseUrl);
const management = new LoginIdManagement(managementId, privateKey, baseUrl);

const router = express.Router();

const setUser = (req, res, jwt, user) => {
  req.session.user = user;

  res.cookie("authorization", jwt, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    signed: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

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

router.post("/codes/:authentication/generate", async (req, res) => {
  const { username } = req.body;
  const { authentication } = req.params;
  const type = "short";
  const authorize = false;
  const purpose =
    authentication === "add"
      ? "add_credential"
      : authentication === "push"
      ? "temporary_authentication"
      : "";

  if (!purpose) {
    return res.status(422).json({ message: "No purpose found" });
  }

  if (!username) {
    return res.status(422).json({ message: "No username received" });
  }

  try {
    const id = await management.getUserId(username);

    const { code } = await management.generateCode(
      id,
      type,
      purpose,
      authorize
    );
    return res.status(201).json({ code });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
});

router.post("/codes/wait", async (req, res) => {
  const { username, code } = req.body;
  const type = "short";

  if (!username) {
    return res.status(422).json({ message: "No username received" });
  }

  try {
    const { user, jwt } = await management.waitCode(username, code, type);
    setUser(req, res, jwt, user);
    return res.status(204).json({ message: "OK" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
});

router.post("/codes/:authentication/authorize", async (req, res) => {
  debugger;
  const { username, code } = req.body;
  const { authentication } = req.params;
  const type = "short";
  const purpose =
    authentication === "add"
      ? "add_credential"
      : authentication === "push"
      ? "temporary_authentication"
      : "";

  if (!username) {
    return res.status(422).json({ message: "No username received" });
  }

  if (!username) {
    return res.status(422).json({ message: "No username received" });
  }

  try {
    const id = await management.getUserId(username);
    await management.authorizeCode(id, code, type, purpose);
    return res.status(204).end();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
});

module.exports = router;
