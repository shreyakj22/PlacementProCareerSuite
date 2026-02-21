const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({
  company: { type: String, required: true },
  criteria: {
    minCgpa: { type: Number, default: 0 },
    maxBacklogs: { type: Number, default: 0 },
    branches: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Drive", driveSchema);
