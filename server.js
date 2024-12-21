const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config.mongodb");

const server = app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server express"));
  // Handle server crash push message to channel chat development
  process.exit(0);
});
