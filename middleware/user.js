const { LoginId } = require("@loginid/node-sdk");

const webId = process.env.WEB_CLIENT_ID;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const baseUrl = process.env.BASE_URL;

const loginId = new LoginId(webId, privateKey, baseUrl);

const validateJWt = async (req, res, next) => {
  let jwt;

  if (req.body.jwt && req.body.user) {
    jwt = req.body.jwt;
    req.session.user = req.body.user;
  }

  if (req.signedCookies["authorization"] && req.session.user) {
    jwt = req.signedCookies["authorization"];
  }

  if (!jwt) {
    return res.redirect("/");
  }

  try {
    const isValid = await loginId.verifyToken(jwt);

    if (!isValid) {
      throw new Error("Authorization failed");
    }

    req.jwt = jwt;

    return next();
  } catch (e) {
    console.error(e);
    return res.status(401).render("error", { message: e.message });
  }
};

const setJwt = (req, res, next) => {
  const { jwt } = req;

  if (!jwt) {
    return res.status(404).render("error", { message: "JWT does not exist" });
  }

  res.cookie("authorization", jwt, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    signed: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  next();
};

module.exports = { validateJWt, setJwt };
