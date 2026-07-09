const User = require("../models/User");
const OTP = require("../models/OTP");
const generateOTP = require("../utils/otpGenerator");
const transporter = require("../config/mail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const VerifiedEmail = require("../models/VerifiedEmail");
/*
---------------------------------------
Check Email
---------------------------------------
*/

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.json({
        success: true,
        exists: true,
        message: "Email already registered",
      });
    }

    return res.json({
      success: true,
      exists: false,
      message: "Email not registered",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Remove previous OTP if any
    await OTP.deleteMany({ email });

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({
      email,
      otp,
      expiresAt,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Virtual Interior Designer - Email Verification",

      html: `
        <h2>Email Verification</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP for the email
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Check OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    // Save verified email for 10 minutes
    await VerifiedEmail.findOneAndUpdate(
      { email },
      {
        email,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if email was verified
    const verified = await VerifiedEmail.findOne({ email });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      emailVerified: true,
    });

    // Remove temporary verification record
    await VerifiedEmail.deleteOne({ email });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  checkEmail,
  sendOTP,
  verifyOTP,
  register,
  login,
};
