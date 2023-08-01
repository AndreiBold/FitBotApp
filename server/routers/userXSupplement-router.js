const express = require("express");
const router = express.Router();
const models = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const auth = require("../middleware/auth");

const simpleFormatDate = (today) => {
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
};

// @route  GET usersXSupplements/supplements
// @desc   Get user's list of supplements by date
// @access Private
router.get("/supplements", auth, async (req, res) => {
  try {
    var result = {};
    var fitnessDetails;
    let defaultData = {};
    let userdata = await models.FitnessDetail.findAll({
      limit: 1,
      where: {
        userId: req.user.userId,
        date: { [Op.lte]: req.query.date },
      },
      order: [["date", "DESC"]],
      attributes: ["totalDailyCalories", "protein", "carbs", "fats"],
    });

    if (!userdata[0]) {
      defaultData.totalDailyCalories = 0;
      defaultData.protein = 0;
      defaultData.carbs = 0;
      defaultData.fats = 0;
      fitnessDetails = defaultData;
    } else {
      fitnessDetails = userdata[0];
    }

    result.supplements = [];
    var userxsupplements;
    if (req.query.date) {
      userxsupplements = await models.UserXSupplement.findAll({
        where: {
          userId: req.user.userId,
          dateTime: { [Op.startsWith]: req.query.date },
        },
        attributes: ["noUnits", "dateTime", "details", "supplementId"],
      });
    } else {
      userxsupplements = await models.UserXSupplement.findAll({
        where: {
          userId: req.user.userId,
        },
        attributes: ["noUnits", "dateTime", "details", "supplementId"],
      });
    }
    for (var i = 0; i < userxsupplements.length; i++) {
      var supplementItem = {};
      var currentSupplement = userxsupplements[i];
      supplementItem.usersupplementData = currentSupplement;
      var supplement = await models.Supplement.findOne({
        where: currentSupplement.supplementId,
        attributes: [
          "name",
          "benefit",
          "measureUnit",
          "caloriesPerUnit",
          "proteinPerUnit",
          "carbsPerUnit",
          "fatsPerUnit",
        ],
      });
      supplementItem.supplementDetails = supplement;
      result.supplements.push(supplementItem);
    }
    var usersupplementList = result.supplements;

    res.status(200).json({ fitnessDetails, usersupplementList });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST usersXSupplements/supplement/:sid
// @desc   Add one food to user's journal
// @access Private
router.post("/supplement/:sid", auth, async (req, res) => {
  let usersupplement = req.body;
  if (!usersupplement.noUnits || !usersupplement.details)
    return res.status(400).json({ message: "Please complete all fields" });
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let supplement = await models.Supplement.findOne({
      where: { supplementId: req.params.sid },
      attributes: [
        "name",
        "benefit",
        "measureUnit",
        "caloriesPerUnit",
        "proteinPerUnit",
        "carbsPerUnit",
        "fatsPerUnit",
      ],
    });
    if (!supplement) throw Error("Supplement not found");

    let existingUsersupplement = await models.UserXSupplement.findOne({
      where: {
        userId: user.userId,
        supplementId: req.params.sid,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    if (existingUsersupplement)
      throw Error(
        "You cannot add the same supplement twice for the same day. Instead, update the units of the existing one"
      );

    usersupplement.userId = user.userId;
    usersupplement.supplementId = parseInt(req.params.sid);
    await models.UserXSupplement.create(usersupplement);
    let usersupplementItem = {};
    usersupplementItem.usersupplementData = usersupplement;
    usersupplementItem.supplementDetails = supplement;
    res.status(201).json({
      usersupplementItem,
      message: "Added supplement successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  POST usersXSupplements/supplement/
// @desc   Let Jarvis add one food to user's journal
// @access Private
router.post("/supplement/", auth, async (req, res) => {
  let usersupplement = req.body;
  if (!usersupplement.noUnits || !usersupplement.details)
    return res.status(400).json({ message: "Please complete all fields" });
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let supplement = await models.Supplement.findOne({
      where: { name: req.query.name },
    });
    if (!supplement) throw Error("Supplement not found");

    let existingUsersupplement = await models.UserXSupplement.findOne({
      where: {
        userId: user.userId,
        supplementId: supplement.supplementId,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    if (existingUsersupplement)
      throw Error(
        "You cannot add the same supplement twice for the same day. Instead, update the units of the existing one"
      );

    usersupplement.userId = user.userId;
    usersupplement.supplementId = supplement.supplementId;
    await models.UserXSupplement.create(usersupplement);
    let usersupplementItem = {};
    usersupplementItem.usersupplementData = usersupplement;
    usersupplementItem.supplementDetails = supplement;
    res.status(201).json({
      usersupplementItem,
      message: "Added supplement successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT usersXSupplements/supplement/:sid/:dateTime
// @desc   Update one food from user's journal
// @access Private
router.put("/supplement/:sid/:dateTime", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let supplement = await models.Supplement.findOne({
      where: { supplementId: req.params.sid },
      attributes: [
        "name",
        "benefit",
        "measureUnit",
        "caloriesPerUnit",
        "proteinPerUnit",
        "carbsPerUnit",
        "fatsPerUnit",
      ],
    });
    if (!supplement) throw Error("Supplement not found");

    let usersupplement = await models.UserXSupplement.findOne({
      where: {
        userId: user.userId,
        supplementId: req.params.sid,
        dateTime: req.params.dateTime,
      },
    });
    if (!usersupplement) throw Error("Invalid payload");

    await usersupplement.update(req.body, {
      fields: ["noUnits", "details"],
    });
    let usersupplementItem = {};
    usersupplementItem.usersupplementData = usersupplement;
    usersupplementItem.supplementDetails = supplement;
    let supplementId = usersupplement.supplementId;
    let dateTime = usersupplement.dateTime;
    res.status(201).json({
      supplementId,
      dateTime,
      usersupplementItem,
      message: "Updated supplement successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE usersXSupplements/supplement/:sid/:dateTime
// @desc   Delete one supplement from user's journal
// @access Private
router.delete("/supplement/:sid/:dateTime", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let supplement = await models.Supplement.findByPk(req.params.sid);
    if (!supplement) throw Error("Supplement not found");

    let usersupplement = await models.UserXSupplement.findOne({
      where: {
        userId: user.userId,
        supplementId: supplement.supplementId,
        dateTime: req.params.dateTime,
      },
    });

    let supplementId = usersupplement.supplementId;
    let dateTime = usersupplement.dateTime;

    if (!usersupplement) throw Error("Invalid payload");
    await usersupplement.destroy(req.body);
    res.status(201).json({
      supplementId,
      dateTime,
      message: "Removed supplement successfully from the journal",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE usersXSupplements/supplement/
// @desc   Let Jarvis delete one supplement from user's journal
// @access Private
router.delete("/supplement/", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let supplement = await models.Supplement.findOne({
      where: { name: req.query.name },
    });
    if (!supplement) throw Error("Supplement not found");

    let usersupplement = await models.UserXSupplement.findOne({
      where: {
        userId: user.userId,
        supplementId: supplement.supplementId,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    let supplementId = usersupplement.supplementId;
    let dateTime = usersupplement.dateTime;

    if (!usersupplement) throw Error("Invalid payload");
    await usersupplement.destroy(req.body);
    res.status(201).json({
      supplementId,
      dateTime,
      message: "Removed supplement successfully from the journal",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
