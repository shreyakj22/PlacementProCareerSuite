const express = require("express");
const router = express.Router();
const { createDrive, getDrives } = require("../controllers/driveController");

router.post("/create", createDrive);
router.get("/all", getDrives);

module.exports = router;
