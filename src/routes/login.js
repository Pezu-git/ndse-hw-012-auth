var express = require("express");
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

module.exports = function (passport) {
  router.get("/", function (req, res) {
    res.render("login");
  });

  router.post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/me",
      failureRedirect: "/",
      failureFlash: true,
    })
  );

  router.get("/signup", function (req, res) {
    res.render("register", { message: req.flash("message") });
  });

  router.post(
    "/signup",
    passport.authenticate("signup", {
      successRedirect: "/me",
      failureRedirect: "/signup",
      failureFlash: true,
    })
  );

  router.get("/me", isAuthenticated, function (req, res) {
    res.render("me", { user: req.user });
  });

  router.get("/signout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
  return router;
};
