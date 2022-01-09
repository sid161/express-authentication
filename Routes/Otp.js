const bcrypt = require("bcrypt");
const router = require("express").Router();
const_ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");

const { Otp } = require("../Models/otpModel");
const { User } = require("../Models/User.model");

router.post("/signup", async (req, res) => {
  const user = await Otp.findOne({
    phone: req.body.phone,
  });
  if (user) return res.status("User already registered");
  const OTP = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const phone = req.body.phone;
  console.log(OTP);

  const otp = new Otp({ phone: phone, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res.status(200).send("Otp send succesfullt");
});

router.post("/signup/verify", async (req, res) => {});

module.exports = router;
