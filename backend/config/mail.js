const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail Server Error:", error);
  } else {
    console.log("✅ Mail Server Connected");
  }
});

module.exports = transporter;
