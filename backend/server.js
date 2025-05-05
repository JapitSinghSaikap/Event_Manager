const express = require("express");
const { connectDB } = require("./lib/db");
require("dotenv").config();

const cors = require("cors");
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const organiserRoutes = require("./routes/organiser_routes");
const eventRoutes = require("./routes/event_routes");
const assignmentRoutes = require("./routes/assignment_routes");

app.use("/organisers", organiserRoutes);
app.use("/events", eventRoutes);
app.use("/assignments", assignmentRoutes);

// Server Listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
