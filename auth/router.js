const bcryptjs = require("bcryptjs");

const router = require("express").Router();
const Users = require("../users/users-model");
const { isValid } = require("../users/users-service");

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 12;

    // hash the password real good
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    // save user to db
    Users.add(credentials)
      .then((user) => {
        req.session.loggedIn === true;

        req.status(201).json({ data: user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(400).json({
      message: "Username and password required. Password must be alpanumeric.",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        //compare password entered with the hash in db
        if (user && bcryptjs.compareSync(password, user.password)) {
          // it's now safe to save the client info in the session
          req.session.loggedIn = true;
          req.session.user = user;

          res.status(200).json({ message: `Welcome ${user}.` });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message: "Username and password required. Password must be alpanumeric.",
    });
  }
});

module.exports = router;
