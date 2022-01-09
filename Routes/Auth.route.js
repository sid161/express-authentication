const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const User = require("../Models/User.model");
const { authSchema, loginSchema } = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const { verify } = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  try {
    // const { name, email, password, phone } = req.body;
    // console.log(req.body);
    const result = await authSchema.validateAsync(req.body);
    console.log(result);

    const doesExist = await User.findOne({
      email: result.email,
      phone: result.phone,
    });
    if (doesExist)
      throw createError.Conflict(`${result.email} is already registered`);

    // const OTP = otpGenerator.generate(6, {
    //   digits: true,
    //   alphabets: false,
    //   upperCase: false,
    //   specialChars: false,
    // });
    // const phone = req.body.phone;
    // console.log(OTP);

    // const otp = new Otp({ phone: phone, otp: OTP });
    // const salt = await bcrypt.genSalt(10);
    // otp.otp = await bcrypt.hash(otp.otp, salt);
    // const result = await otp.save();
    // return res.status(200).send("Otp send succesfully");

    const user = new User(result);

    const savedUser = await user.save();
    console.log(savedUser);
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    console.log(accessToken, "+++++++++++++++++++++");
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body);
    console.log(result);

    const user = await User.findOne({ email: result.email });
    console.log(user);
    if (!user) throw createError.NotFound("user not registered");

    const isMatch = await user.isValidPassword(result.password);
    console.log(isMatch);
    if (!isMatch) throw createError.Unauthorized("username/password not valid");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("invalid username or password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({ accessToken: accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
