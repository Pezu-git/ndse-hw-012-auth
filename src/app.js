const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
const dbConfig = require("./db");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));

mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("successfully connected to the database");
  })
  .catch((err) => {
    console.log(err);
    console.log("error connecting to the database");
    process.exit();
  });
app.use(
  expressSession({
    secret: "mySecretKey",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const flash = require("express-flash-messages");
app.use(flash());

var initPassport = require("./passpInit/init");
initPassport(passport);
const routes = require("./routes/login")(passport);
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
