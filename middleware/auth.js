const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const bearerToken = token.split(" ")[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).send('Forbidden');
        }
        req.userID = decoded.user_id;
        return next();
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;