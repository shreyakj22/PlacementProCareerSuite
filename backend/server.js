require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const driveRoutes = require("./routes/driveRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "..", "Frontend")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/drives", driveRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:Placement@cluster0.whimomm.mongodb.net/placementpro?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Login page: http://localhost:${PORT}/login.html`);
    });
  })
  .catch((err) => console.log("Database Connection Failed", err));
