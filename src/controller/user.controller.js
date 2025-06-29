const { getCollection } = require("../dbConnection");
const generateToken = require("../utils/jwtToken");

const createUser =
  ("/",
  async (req, res) => {
    try {
      const { users } = getCollection();
      if (!users) {
        return res.status(500).send({ error: "Database not connected" });
      }

      const { email } = req.body;

      const isExist = await users.findOne({ email });
      if (isExist) {
        return res.status(500).send({
          message: "Email already in use.",
          success: false,
        });
      }
      const user = await users.insertOne(req.body);
      if (user.insertedId) {
        const token = generateToken(req.body.email);

        return res.status(201).send({
          message: "User has been created successfully",
          success: true,
          user: req.body,
          token,
        });
      } else {
        return res.status(400).send({ error: "User creation failed" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  });

const loginUser =
  ("/",
  async (req, res) => {
    try {
      const { users } = getCollection();
      const { email, password } = req.body;
      const user = await users.findOne({ email });
      console.log(user);
      if (user?.password !== password && user?.email !== email) {
        return res.status(200).send({
          message: "Login failed",
          success: false,
        });
      }
      const token = generateToken(email);
      return res.status(200).send({
        message: "Login success",
        success: true,
        token,
      });
    } catch (error) {
      console.log(error);
    }
  });

module.exports = { createUser, loginUser };
