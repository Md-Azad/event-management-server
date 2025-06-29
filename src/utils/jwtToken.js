const jwt = require("jsonwebtoken");
const config = require("../config");

const generateToken = (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, config.token, {
    expiresIn: "2",
  });
  res.send({ token });
  next();
};

module.exports = generateToken;
