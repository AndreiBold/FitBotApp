const express = require("express");
const router = express.Router();
const models = require("../models");
const chatLib = require("../jarvis/chat-library");
const auth = require("../middleware/auth");

// @route  POST chat/
// @desc   Send a message to the chatbot
// @access Private
// router.post("/", auth, async (req, res) => {
//   try {
//     let user = await models.User.findByPk(req.user.userId);
//     if (!user) throw Error("User not found");
//     let { message, context } = req.body;
//     let manager = chatLib.trainJarvis();
//     let response = await chatLib.processChat(message, context, manager, user);
//     console.log(response);
//     res.status(201).json(response);
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// });
router.post("/", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");
    let { message, context } = req.body;
    let nlp = await chatLib.trainJarvis();
    let response = await chatLib.processChat(message, context, nlp, user);
    console.log(response);
    res.status(201).json(response);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
