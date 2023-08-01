const express = require("express");
const router = express.Router();
const models = require("../models");
const auth = require("../middleware/auth");

// @route  GET contexts/
// @desc   Get user's current context from discussion with chatbot
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    let currentContext = {};
    let context = await models.Context.findByPk(req.user.userId);
    if (context) currentContext = context;
    res.status(200).json(currentContext);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// // @route  PUT contexts/
// // @desc   Add or update user's context from discussion with chatbot
// // @access Private
router.put("/", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let currentContext = await models.Context.findByPk(user.userId);
    if (!currentContext) {
      let context = req.body;
      context.userId = user.userId;
      await models.Context.create(context);
      return res
        .status(201)
        .json({ message: "Added conversation context succesfully" });
    } else {
      currentContext.update({
        content: req.body.content,
        dateTime: req.body.dateTime,
      });
      await currentContext.save();
      return res
        .status(201)
        .json({
          currentContext,
          message: "Updated conversation context succesfully",
        });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
