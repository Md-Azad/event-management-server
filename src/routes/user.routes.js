const { createUser, loginUser } = require("../controller/user.controller");

const userRoutes = require("express").Router();

userRoutes.post("/", createUser);
userRoutes.post("/login", loginUser);

module.exports = userRoutes;
