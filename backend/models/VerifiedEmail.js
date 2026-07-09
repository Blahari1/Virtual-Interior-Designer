const mongoose = require("mongoose");

const verifiedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("VerifiedEmail", verifiedEmailSchema);
