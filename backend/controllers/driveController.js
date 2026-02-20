const Drive = require("../models/Drive");

exports.createDrive = (req, res) => {
  const { company, role, date, location } = req.body;

  Drive.create(company, role, date, location, (err, data) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Drive Created" });
  });
};

exports.getDrives = (req, res) => {
  Drive.getAll((err, data) => {
    if (err) return res.status(500).json(err);

    res.json(data);
  });
};