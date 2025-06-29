const jwt = require("jsonwebtoken");
const config = require("../config");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.token, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "JWT expired" });
      }
      return res.status(401).send({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
