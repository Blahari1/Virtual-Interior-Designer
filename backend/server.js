const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const connectDB = require("./config/db");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
dotenv.config();

connectDB();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors(),
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Virtual Interior Designer Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const transporter = require("./config/mail");

/*transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Ready");
  }
});*/
