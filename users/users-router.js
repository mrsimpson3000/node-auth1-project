const router = require("express").Router();
const Users = require("./users-model");

// Could this be the global middleware you were looking for?
function restricted(req, res, next) {
  if (req.session && req.session.loggedin) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
}

router.use(restricted);

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
