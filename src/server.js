const { createServer } = require("http");
const app = require("./app");
const config = require("./config");
const { dbConnection } = require("./dbConnection");

const routes = require("./routes");

const PORT = config.port || 5000;

async function main() {
  try {
    dbConnection();

    app.use(routes);

    createServer(app).listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error);
  }
}
main();
