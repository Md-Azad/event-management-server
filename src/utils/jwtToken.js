const jwt = require("jsonwebtoken");
const config = require("../config");

const generateToken = (email) => {
  const token = jwt.sign({ email }, config.token, {
    expiresIn: "2h",
  });
  return token;
};

module.exports = generateToken;
