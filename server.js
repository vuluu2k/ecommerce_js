const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server express"));
  // Handle server crash
});