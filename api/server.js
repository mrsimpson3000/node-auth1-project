const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const server = express();

const sessionConfig = {
  cookie: {
    maxAge: 1000 * 60 * 60, // 1000ms (1 sec) * 60seconds (1 min) * 60minutes (1 hour)
    secure: process.env.SECURE_COOKIE || false, // send the cookie over only https, true in production
    httpOnly: true, // true means client JS cannot access the cookie. good for auth purposes.
  },
  resave: false,
  saveUnitialized: process.env.USER_ALLOWED_COOKIES || true,
  name: "partytime",
  secret: process.env.COOKIE_SECRET || "secretsociety",
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
