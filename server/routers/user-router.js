const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const JWT_SECRET = process.env.JWT_SECRET;
const HOST = process.env.HOST;
const MAILER_USER = process.env.MAILER_USER;
const MAILER_PASSWORD = process.env.MAILER_PASSWORD;
const CLIENT_HOST = process.env.CLIENT_HOST;

// @route  GET users/
// @desc   Get all users
// @access Public
router.get("/", async (req, res) => {
  try {
    //getting the list of users
    let users = await models.User.findAll();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// @route  POST users/
// @desc   Register new user
// @access Public
router.post("/", async (req, res) => {
  let reqBody = req.body;

  // check valid request
  if (
    !reqBody.firstName ||
    !reqBody.lastName ||
    !reqBody.email ||
    !reqBody.password ||
    !reqBody.confirmPassword ||
    !reqBody.securityAnswer ||
    !reqBody.birthDate ||
    !reqBody.gender
  )
    return res.status(400).json({ message: "Please enter all fields" });

  try {
    // check for existing user
    let user = await models.User.findOne({
      where: { email: reqBody.email },
    });

    if (user) throw Error("User already exists");

    // check if the password is valid
    let testRegexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!testRegexPass.test(reqBody.password))
      throw Error(
        "Please enter a password containing at least one lower case, one upper case, one digit and min 8 characters"
      );

    // check if password confirmation is correct
    if (reqBody.password !== reqBody.confirmPassword)
      throw Error("Passwords don't match");

    // check if date format is valid
    let testRegexDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

    if (
      !testRegexDate.test(reqBody.birthDate) ||
      isNaN(new Date(reqBody.birthDate).getTime())
    )
      throw Error("Please enter a valid date in format YYYY-MM-DD");

    // hash the password
    reqBody.password = await bcrypt.hash(reqBody.password, 10);
    if (!reqBody.password)
      throw Error("Something went wrong hashing the password");

    // create user
    let newUser = await models.User.create(reqBody);

    //getting userdata
    let userData = await models.User.findOne({
      where: { userId: newUser.userId },
      attributes: ["userId", "firstName", "lastName", "email"],
    });

    // generate token
    let token = jwt.sign({ userId: userData.userId }, JWT_SECRET, {
      expiresIn: 3600,
    });

    if (!token) throw Error("Couldn't sign the token");

    res.status(201).json({
      token,
      userData,
      message: "Registered successfully!",
    });
  } catch (e) {
    if (e.message.includes("Invalid date"))
      return res
        .status(400)
        .json({ message: "Please enter a valid date in format YYYY-MM-DD" });
    res.status(400).json({ message: e.message });
  }
});

// @route  POST users/login
// @desc   Login user
// @access Public
router.post("/login", async (req, res) => {
  let reqBody = req.body;

  //check valid request
  if (!reqBody.email || !reqBody.password)
    return res.status(400).json({ message: "Please enter all fields" });
  try {
    // check for existing user
    let user = await models.User.findOne({
      where: { email: reqBody.email },
    });

    if (!user) throw Error("User not found");

    // check if user is still active
    if (!user.isActive)
      throw Error(
        "Your account is no longer active. Please contact us and we will fix the matter"
      );

    // check if the password is correct
    if (!(await bcrypt.compare(reqBody.password, user.password)))
      throw Error("Invalid credentials");

    //getting userdata
    let userData = await models.User.findOne({
      where: { userId: user.userId },
      attributes: ["userId", "firstName", "lastName", "email"],
    });

    // generate token
    let token = jwt.sign({ userId: userData.userId }, JWT_SECRET, {
      expiresIn: 3600,
    });
    if (!token) throw Error("Couldn't sign the token");

    res.status(201).json({
      token,
      userData,
      message: "Logged-in successfully!",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET users/userdata
// @desc   Get user's account info
// @access Private
router.get("/userdata", auth, async (req, res) => {
  try {
    //check if the desired user exists
    let user = await models.User.findOne({
      where: { userId: req.user.userId },
      attributes: [
        "userId",
        "firstName",
        "lastName",
        "email",
        "isActive",
        "birthDate",
        "gender",
      ],
    });

    if (user == null) throw Error("User not found");

    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST users/forgot_password
// @desc   Enter info for password recovery
// @access Public
router.post("/forgot_password", async (req, res) => {
  let reqBody = req.body;

  //check valid request
  if (!reqBody.email || !reqBody.securityAnswer)
    return res.status(400).json({ message: "Please enter all fields" });

  try {
    // check for existing user
    let user = await models.User.findOne({
      where: { email: reqBody.email },
    });

    if (!user) throw Error("Invalid email address");

    // check if security answer is valid
    if (user.securityAnswer !== reqBody.securityAnswer)
      throw Error("Invalid security answer");

    // crypting reset pass token
    let token = crypto.randomBytes(20).toString("hex");

    if (!token) throw Error("Problems when crypting password reset token");

    // assign reset password token to user and set expiration date for link
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // create transporter for sending email to user
    var smtpTransport = nodemailer.createTransport({
      host: HOST,
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASSWORD,
      },
    });

    //set email options
    var mailOptions = {
      to: user.email,
      from: MAILER_USER,
      subject: "Fitness App Password Reset",
      text:
        "Hello " +
        `${user.firstName} ${user.lastName},\n\n` +
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://" +
        CLIENT_HOST +
        "/reset/" +
        token +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged. Stay healthy!\n\n" +
        "Best regards, \n\n" +
        "Fitbot team.\n",
    };

    //sending the email to user via transporter
    let isSent = true;
    smtpTransport.sendMail(mailOptions, function (err, data) {
      if (err) isSent = false;
    });

    //check if email was sent
    if (!isSent) throw Error("Something went wrong when sending the email");

    res.status(201).json({
      message: `If the address is valid, we just sent you an email with a recovery link at ${user.email} address`,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
    // next(e);
  }
});

// @route  POST users/reset/:token
// @desc   Access recovery link and set new password
// @access Public
router.post("/reset/:token", async (req, res) => {
  let reqBody = req.body;

  //check for valid request
  if (!reqBody.newPassword || !reqBody.confirmPassword)
    return res.status(400).json({ message: "Please enter all fields" });

  try {
    //check if recover password token is still valid
    let user = await models.User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) throw Error("Password reset token is invalid or has expired");

    // check for valid new password
    let testRegexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!testRegexPass.test(reqBody.newPassword))
      throw Error(
        "Please enter a new password containing at least one lower case, one upper case, one digit and min 8 characters"
      );

    if (reqBody.newPassword === user.password)
      throw Error("New password must be different from the old one");

    //check for valid password confirmation
    if (reqBody.newPassword !== reqBody.confirmPassword)
      throw Error("Passwords do not match");

    // hash the new password
    reqBody.newPassword = await bcrypt.hash(reqBody.newPassword, 10);
    if (!reqBody.newPassword)
      throw Error("Something went wrong hashing the new password");

    //update and save changes in user account
    user.password = reqBody.newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // create transporter for sending email to user
    var smtpTransport = nodemailer.createTransport({
      host: HOST,
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASSWORD,
      },
    });

    //set email options
    var mailOptions = {
      to: user.email,
      from: MAILER_USER,
      subject: "Your password has been changed",
      text:
        "It's us again :),\n\n" +
        "This is a confirmation that the password for your account " +
        user.email +
        " has just been changed. Stay healthy!\n\n" +
        "Best regards, \n\n" +
        "Fitbot team.\n",
    };

    //sending the email to user via transporter
    let isSent = true;
    smtpTransport.sendMail(mailOptions, function (err, data) {
      if (err) isSent = false;
    });

    //check if email was sent
    if (!isSent)
      throw Error(
        "Something went wrong when sending the confirmation the email"
      );

    res.status(201).json({
      message:
        "Password changed successfully. You can now log-in to your account.",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST users/change_password
// @desc   Change old password
// @access Private
router.post("/change_password", auth, async (req, res) => {
  let reqBody = req.body;
  //check valid request
  if (!reqBody.email || !reqBody.oldPassword || !reqBody.newPassword) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    //check if user exists
    let user = await models.User.findOne({
      where: { userId: req.user.userId, email: reqBody.email },
    });

    if (!user) throw Error("User not found");

    //check if old password is valid
    if (!(await bcrypt.compare(req.body.oldPassword, user.password)))
      throw Error("Wrong password");

    // check for valid new password
    let testRegexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!testRegexPass.test(reqBody.newPassword))
      throw Error(
        "Please enter a new password containing at least one lower case, one upper case, one digit and min 8 characters"
      );

    if (reqBody.newPassword === reqBody.oldPassword)
      throw Error("New password must be different from the old one");

    // hash the new password
    reqBody.newPassword = await bcrypt.hash(reqBody.newPassword, 10);
    if (!reqBody.newPassword)
      throw Error("Something went wrong hashing the new password");

    // update and save changes in user account
    user.password = reqBody.newPassword;
    await user.save();

    res.status(201).json({
      message:
        "Password changed successfully. Please log-in again to your account",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT users/userdata
// @desc   Update account data
// @access Private
router.put("/userdata", auth, async (req, res) => {
  let reqBody = req.body;
  if (!reqBody.firstName || !reqBody.lastName || !reqBody.email)
    return res.status(400).json({ message: "Please complete all fields" });
  try {
    let user = await models.User.findOne({
      where: { userId: req.user.userId },
    });

    // check if user exists
    if (!user) throw Error("User not found");

    //update and save changes in user account
    if (reqBody.firstName) user.update({ firstName: req.body.firstName });
    if (reqBody.lastName) user.update({ lastName: req.body.lastName });
    if (reqBody.email) user.update({ email: req.body.email });
    await user.save();
    res
      .status(201)
      .send({ user, message: "Your account was updated successfully" });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE users/userdata
// @desc   Disable user account
// @access Private
router.delete("/userdata", auth, async (req, res) => {
  try {
    let user = await models.User.findOne({
      where: { userId: req.user.userId },
    });

    // check if user exists
    if (!user) throw Error("User not found");

    // disable account and save changes
    if (user.isActive === true) {
      user.update({ isActive: false });
      await user.save();
    }
    res.status(201).send({
      message: "User disabled successfully. We hope we'll see you again soon.",
    });
  } catch (err) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
