const eventRoutes = require("./event.routes");
const userRoutes = require("./user.routes");

const routes = require("express").Router();

routes.use("/api/users", userRoutes);
routes.use("/api/events", eventRoutes);

module.exports = routes;
