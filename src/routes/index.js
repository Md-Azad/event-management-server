const userRoutes = require("./user.routes");

const routes = require("express").Router();

routes.use("/api/users", userRoutes);

module.exports = routes;
