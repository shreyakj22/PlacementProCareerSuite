const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  branch: String,
  cgpa: Number,
  backlogs: { type: Number, default: 0 },
  email: String,
  phone: String,
  skills: [String],
  projects: [String]
});

module.exports = mongoose.model("Student", studentSchema);
