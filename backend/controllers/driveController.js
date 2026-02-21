const Drive = require("../models/drive");

exports.createDrive = async (req, res) => {
  try {
    const { company, criteria } = req.body;
    const drive = new Drive({ company, criteria });
    await drive.save();
    res.json({ message: "Drive created", drive });
  } catch (err) {
    res.status(500).json({ error: "Failed to create drive" });
  }
};

exports.getDrives = async (req, res) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch drives" });
  }
};
