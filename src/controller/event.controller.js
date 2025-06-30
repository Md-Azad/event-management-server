const { ObjectId } = require("mongodb");
const { getCollection } = require("../dbConnection");
const authMiddleware = require("../middleware/authMiddleware");

// Event Title
// ○ Name (who posted the Event)
// ○ Date and Time
// ○ Location
// ○ Description
// ○ A
// endeeCount (number, default 0)

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

module.exports = { createEvent, updateEvent };
