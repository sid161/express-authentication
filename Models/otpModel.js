const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
  },
  { timestamps: true }
);

const Otp = mongoose.model("otp", OtpSchema);
module.exports = Otp;
