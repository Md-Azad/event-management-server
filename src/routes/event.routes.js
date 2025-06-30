const { createEvent, updateEvent } = require("../controller/event.controller");

const eventRoutes = require("express").Router();

eventRoutes.post("/", createEvent);
eventRoutes.post("/:id", updateEvent);

module.exports = eventRoutes;
