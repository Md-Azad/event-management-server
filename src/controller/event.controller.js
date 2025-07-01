const { ObjectId } = require("mongodb");
const { getCollection } = require("../dbConnection");
const authMiddleware = require("../middleware/authMiddleware");

const createEvent =
  ("/",
  authMiddleware,
  async (req, res) => {
    try {
      const { name, email, title, location, description, date, time, count } =
        req.body;

      const eventPayload = {
        name,
        email,
        title,
        location,
        description,
        date,
        time,
        count: count || 0,
        join: [],
      };
      const { events } = getCollection();
      const data = await events.insertOne(eventPayload);
      if (!data.insertedId) {
        return res.status(400).send({
          message: "Event creation unsuccessful",
          success: false,
          id: null,
        });
      }

      return res.status(201).send({
        message: "Event created successfully",
        success: true,
        id: data.insertedId,
      });
    } catch (error) {
      console.log(error);
    }
  });
const joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .send({ message: "Email is required", success: false });
    }

    const { events } = getCollection();

    if (!ObjectId.isValid(eventId)) {
      return res
        .status(400)
        .send({ message: "Invalid event ID", success: false });
    }

    // Find the event
    const event = await events.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res
        .status(404)
        .send({ message: "Event not found", success: false });
    }

    // Check if user already joined
    if (event.join.includes(email)) {
      return res
        .status(400)
        .send({ message: "User already joined this event", success: false });
    }

    // Add user to join array and update count
    const updatedJoin = [...event.join, email];
    const updatedCount = updatedJoin.length;

    const result = await events.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: { join: updatedJoin, count: updatedCount } }
    );

    if (result.modifiedCount === 1) {
      return res.status(200).send({
        message: "Successfully joined the event",
        success: true,
        join: updatedJoin,
        count: updatedCount,
      });
    } else {
      return res
        .status(500)
        .send({ message: "Failed to join event", success: false });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const getEvents =
  ("/",
  authMiddleware,
  async (req, res) => {
    try {
      const { events } = getCollection();
      const data = await events.find().toArray();
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  });

const updateEvent =
  ("/",
  authMiddleware,
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const updatedInfo = req.body;
      const { events } = getCollection();

      if (!ObjectId.isValid(eventId)) {
        return res.status(400).send({ message: "Invalid event ID" });
      }

      const result = await events.updateOne(
        { _id: new ObjectId(eventId) },
        { $set: updatedInfo }
      );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .send({ message: "Event not found", success: false });
      }

      return res.status(200).send({
        message: "Event updated successfully",
        success: true,
        id: eventId,
        updatedInfo,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Internal server error", error: error.message });
    }
  });

const deleteEvent =
  ("/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const { events } = getCollection();

      if (!ObjectId.isValid(eventId)) {
        return res.status(400).send({ message: "Invalid event ID" });
      }

      const result = await events.deleteOne({ _id: new ObjectId(eventId) });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .send({ message: "Event not found", success: false });
      }

      return res.status(200).send({
        message: "Event deleted successfully",
        success: true,
        id: eventId,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Internal server error", error: error.message });
    }
  });

module.exports = {
  joinEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
};
