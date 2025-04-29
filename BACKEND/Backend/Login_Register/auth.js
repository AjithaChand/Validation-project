require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {

    console.log("Token verification failed:", err); 

    if (err) return res.sendStatus(403);

    console.log("decoded",user)

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








