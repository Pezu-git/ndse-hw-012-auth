var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/users");
var bCrypt = require("bcryptjs");

module.exports = function (passport) {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        findOrCreateUser = function () {
          User.findOne({ username: username }, function (err, user) {
            if (err) {
              console.log("Ошибка регистрации: " + err);
              return done(err);
            }
            if (user) {
              console.log(`Пользователь ${username} уже зарегистрирован`);
              return done(
                null,
                false,
                req.flash(
                  "error",
                  `Пользователь ${username} уже зарегистрирован`
                )
              );
            } else {
              var newUser = new User();
              const { email, firstName, lastName } = req.body;
              newUser.username = username;
              newUser.password = createHash(password);
              newUser.email = email;
              newUser.firstName = firstName;
              newUser.lastName = lastName;

              newUser.save(function (err) {
                if (err) {
                  console.log("Ошибка регистрации: " + err);
                  throw err;
                }
                console.log("Регистрация успешна");
                return done(null, newUser);
              });
            }
          });
        };
        process.nextTick(findOrCreateUser);
      }
    )
  );

  var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
};
