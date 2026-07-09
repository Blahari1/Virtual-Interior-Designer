const express = require("express");

const router = express.Router();

const {
  checkEmail,
  sendOTP,
  verifyOTP,
  register,login,
} = require("../controllers/authController");

router.post("/check-email", checkEmail);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login",login);
module.exports = router;
