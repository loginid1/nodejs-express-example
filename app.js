const express = require("express");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "assets")));

app.listen(app.get("get"), () => {
  console.log(`Listening at ${app.get("port")}`);
});
