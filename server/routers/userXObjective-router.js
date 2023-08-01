const express = require("express");
const router = express.Router();
const models = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const auth = require("../middleware/auth");

// @route  GET usersXObjectives/objectives
// @desc   Get user's history of objectives
// @access Private
router.get("/objectives", auth, async (req, res) => {
  try {
    var result = {};
    result.userData = await models.User.findOne({
      where: {
        userId: req.user.userId,
      },
    });
    if (!result.userData) throw Error("User data not found");

    result.objectives = [];
    var userxobjectives;
    userxobjectives = await models.UserXObjective.findAll({
      where: {
        userId: req.user.userId,
      },
      attributes: [
        "dateStart",
        "dateStop",
        "objectiveWeight",
        "isCurrentObjective",
        "progressPercent",
        "objectiveId",
      ],
    });

    for (var i = 0; i < userxobjectives.length; i++) {
      var objectiveItem = {};
      var currentObjective = userxobjectives[i];
      objectiveItem.userobjectiveData = currentObjective;
      var objective = await models.Objective.findOne({
        where: { objectiveId: currentObjective.objectiveId },
        attributes: ["name"],
      });
      objectiveItem.objectiveDetails = objective;
      result.objectives.push(objectiveItem);
    }
    var userobjectiveList = result.objectives;

    res.status(200).json(userobjectiveList);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET usersXObjectives/current
// @desc   Get user's current objective
// @access Private
router.get("/current", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    var result = {};
    var userWeights = await models.FitnessDetail.findAll({
      where: { userId: user.userId },
      order: [["date", "DESC"]],
      attributes: ["weight"],
    });
    result.currentObjective = {};
    var userxobjective = await models.UserXObjective.findOne({
      where: {
        userId: req.user.userId,
        isCurrentObjective: true,
      },
    });

    if (!userxobjective) throw Error("User objective data not found");

    result.currentObjective = userxobjective;

    var closestWeightPreObj = await models.FitnessDetail.findAll({
      limit: 1,
      where: {
        userId: req.user.userId,
        date: { [Op.lte]: userxobjective.dateStart },
      },
      order: [["date", "DESC"]],
      attributes: ["weight"],
    });

    var currentWeight = userWeights[0];
    var startWeight = closestWeightPreObj[0];
    if (!currentWeight || !startWeight)
      throw Error("User weight data not found");

    var objective = await models.Objective.findOne({
      where: { objectiveId: userxobjective.objectiveId },
      attributes: ["name"],
    });
    var objectiveName = objective.name;
    var userStartWeight = startWeight.dataValues.weight;
    var userCurrentWeight = currentWeight.dataValues.weight;

    var currentObjective = result.currentObjective;

    res.status(200).json({
      currentObjective,
      objectiveName,
      userStartWeight,
      userCurrentWeight,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST usersXObjectives/objective/
// @desc   Add new objective to user's profile
// @access Private
router.post("/objective/", auth, async (req, res) => {
  let userobjective = req.body;
  if (!userobjective.dateStop || !userobjective.objectiveWeight)
    return res
      .status(400)
      .json({ message: "Please provide all details about your objective" });
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let objective = await models.Objective.findOne({
      where: { name: req.query.name },
    });
    if (!objective) throw Error("Objective not found");

    userobjective.userId = user.userId;
    userobjective.objectiveId = objective.objectiveId;
    await models.UserXObjective.create(userobjective);
    let userobjectiveItem = {};
    userobjectiveItem.userobjectiveData = userobjective;
    userobjectiveItem.objectiveDetails = objective;
    res.status(201).json({
      userobjectiveItem,
      message: "Added objective successfully to your profile",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT usersXObjectives/current
// @desc   Update user's current objective before adding a new one
// @access Private
router.put("/current", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let userxobjective = await models.UserXObjective.findOne({
      where: {
        userId: user.userId,
        isCurrentObjective: true,
      },
    });
    if (!userxobjective) throw Error("Invalid payload");

    let objective = await models.Objective.findOne({
      where: { objectiveId: userxobjective.objectiveId },
      attributes: ["name"],
    });
    if (!objective) throw Error("Objective not found");

    var userWeights = await models.FitnessDetail.findAll({
      where: { userId: user.userId },
      order: [["date", "DESC"]],
      attributes: ["weight"],
    });

    var closestWeightPreObj = await models.FitnessDetail.findAll({
      limit: 1,
      where: {
        userId: user.userId,
        date: { [Op.lte]: userxobjective.dateStart },
      },
      order: [["date", "DESC"]],
      attributes: ["weight"],
    });

    var currentWeight = userWeights[0];
    var startWeight = closestWeightPreObj[0];
    if (!currentWeight || !startWeight)
      throw Error("User weight data not found");

    var extractedCurrentWeight = parseInt(
      currentWeight.dataValues.weight.match(/[a-zA-Z]+|[0-9]+/g)[0]
    );
    var extractedStartWeight = parseInt(
      startWeight.dataValues.weight.match(/[a-zA-Z]+|[0-9]+/g)[0]
    );
    var extractedObjWeight = parseInt(
      userxobjective.objectiveWeight.match(/[a-zA-Z]+|[0-9]+/g)[0]
    );

    if (objective.name === "mantain weight") {
      if (extractedCurrentWeight === extractedStartWeight)
        userxobjective.progressPercent = 100.0;
      else userxobjective.progressPercent = 0.0;
    }

    if (objective.name === "gain weight" || objective.name === "lose weight") {
      if (
        (objective.name === "gain weight" &&
          extractedCurrentWeight < extractedStartWeight) ||
        (objective.name === "lose weight" &&
          extractedCurrentWeight > extractedStartWeight)
      )
        userxobjective.progressPercent = 0.0;
      else {
        var idealDiff = Math.abs(
          parseInt(extractedStartWeight) - parseInt(extractedObjWeight)
        );
        var actualDiff = Math.abs(
          parseInt(extractedCurrentWeight) - parseInt(extractedObjWeight)
        );
        var progress = 100 - (100 * actualDiff) / idealDiff;
        userxobjective.progressPercent = progress.toFixed(2);
      }
    }

    userxobjective.isCurrentObjective = false;

    await userxobjective.save();

    let userobjectiveItem = {};
    userobjectiveItem.userobjectiveData = userxobjective;
    userobjectiveItem.objectiveDetails = objective;
    let objectiveId = userxobjective.objectiveId;
    let dateStart = userxobjective.dateStart;
    res.status(201).json({
      objectiveId,
      dateStart,
      userobjectiveItem,
      message: "Updated current objective successfully",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
