const jwt = require("jsonwebtoken");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb+srv://admin:Placement@cluster0.whimomm.mongodb.net/placementpro?retryWrites=true&w=majority")
.then(() => console.log("Database Connected Successfully"))
.catch((err) => console.log("Database Connection Failed", err));

app.get("/", (req, res) => {
    res.send("Backend is Running");
});
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "User Registered Successfully" });

  } catch (error) {
    res.status(500).json({ error: "Registration Failed" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // 🔥 Generate Token
    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login Successful",
      token: token
    });

  } catch (error) {
    res.status(500).json({ error: "Login Failed" });
  }
});

// 🔐 Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No Token Provided" });
  }

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to Dashboard",
    userId: req.user.id
  });
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});