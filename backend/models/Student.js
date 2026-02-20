const db = require("./db");

const Student = {
  getAll: (cb) => {
    db.query("SELECT * FROM students", cb);
  }
};

module.exports = Student;