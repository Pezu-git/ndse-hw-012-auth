var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/users");
var bCrypt = require("bcryptjs");

module.exports = function (passport) {
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) return done(err);
          if (!user) {
            console.log(`Пользователь ${username} не найден`);

            return done(
              null,
              false,
              req.flash("error", `Пользователь ${username} не найден`)
            );
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, req.flash("error", "Неверный пароль"));
          }
          let message = req.flash();
          return done(null, user, message);
        });
      }
    )
  );

  var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
  };
};
