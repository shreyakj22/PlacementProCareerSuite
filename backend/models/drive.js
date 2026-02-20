const db = require("./db");

const Drive = {
  create: (company, role, date, location, cb) => {
    const sql = "INSERT INTO drives (company, role, date, location) VALUES (?, ?, ?, ?)";
    db.query(sql, [company, role, date, location], cb);
  },

  getAll: (cb) => {
    db.query("SELECT * FROM drives", cb);
  }
};

module.exports = Drive;