const config = require("./config");
const { MongoClient, ServerApiVersion } = require("mongodb");

let users; // Declare users variable in module scope
let events;

async function dbConnection() {
  const uri = config.database_url;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    users = client.db().collection("users");
    events = client.db().collection("events");
    console.log("db connected");
  } catch (error) {
    console.log("something went wrong on Database", error);
  }
}

const getCollection = () => {
  return {
    users,
    events,
  };
};

module.exports = { dbConnection, getCollection };
