const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  joinEvent,
} = require("../controller/event.controller");

const eventRoutes = require("express").Router();

eventRoutes.post("/", createEvent);
eventRoutes.patch("/:id", updateEvent);
eventRoutes.patch("/join/:id", joinEvent);

eventRoutes.delete("/:id", deleteEvent);
eventRoutes.get("/", getEvents);

module.exports = eventRoutes;
