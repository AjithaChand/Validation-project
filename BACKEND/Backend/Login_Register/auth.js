require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader,"hjijojoko")
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token,"gfcviuygfc ")

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = verifyToken;








