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



const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only." });
  }
  next();
};

const verifyUser = (req, res, next) => {
  if (req.user.role !== "user") {
      return res.status(403).json({ message: "Users only." });
  }
  next();
};
module.exports = {verifyToken,verifyAdmin,verifyUser};

// module.exports =verifyToken;








