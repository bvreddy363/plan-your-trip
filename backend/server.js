const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDatabase = require("./config/db");
const express = require("express");
const cors = require("cors");
const destinationRoutes = require("./routes/destinationRoutes");
const tripRoutes = require("./routes/tripRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});