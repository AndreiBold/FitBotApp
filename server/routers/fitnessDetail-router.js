const express = require("express");
const router = express.Router();
const models = require("../models");
const auth = require("../middleware/auth");

const simpleFormatDate = (today) => {
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
};

// @route  GET fitnessDetails/
// @desc   Get user's history of fitness details (weights)
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");
    var fitnessDetailsList;
    fitnessDetailsList = await models.FitnessDetail.findAll({
      limit: 14,
      where: { userId: user.userId },
      order: [["date", "DESC"]],
      attributes: ["date", "weight"],
    });
    res.status(200).json(fitnessDetailsList);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET fitnessDetails/latest
// @desc   Get user's latest fitness details
// @access Private
router.get("/latest", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");
    var fitnessDetails = await models.FitnessDetail.findAll({
      limit: 1,
      where: { userId: user.userId },
      order: [["date", "DESC"]],
    });

    if (!fitnessDetails) throw Error("Fitness details not found");
    else {
      var latestFitnessDetails = fitnessDetails[0];
      res.status(200).json(latestFitnessDetails);
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    var record;
    var intention;
    var user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");
    var fitnessDetails = await models.FitnessDetail.findAll({
      limit: 1,
      where: { userId: user.userId },
      order: [["date", "DESC"]],
    });
    var latest = fitnessDetails[0];
    if (!latest) {
      console.log("Prima adaugare");
      record = await createFitnessRecord(user, req.body);
      intention = "first add";
      return res.status(201).json({
        record,
        intention,
        message: "Added fitness details succesfully to your profile",
      });
    } else {
      if (latest.date === simpleFormatDate(new Date())) {
        console.log("Modificare");
        intention = "modify";
        record = await updateFitnessRecord(user, req);
        res.status(201).json({
          record,
          intention,
          message: "Fitness details updated successfully",
        });
      } else {
        console.log("Urmatoarele adaugari");
        intention = "other adds";
        record = await createFitnessRecord(user, req.body);
        return res.status(201).json({
          record,
          intention,
          message: "Added fitness details succesfully to your profile",
        });
      }
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST fitnessDetails/
// @desc   Add user's new fitness details to his profile
// @access Private
async function createFitnessRecord(user, body) {
  let fitnessDetails = body;

  var newFitnessRecord = {};
  let fitnessRecordsDesc = await models.FitnessDetail.findAll({
    limit: 1,
    where: { userId: user.userId },
    order: [["date", "DESC"]],
  });
  let lastFitnessRecord = fitnessRecordsDesc[0];

  if (!lastFitnessRecord) {
    fitnessDetails.userId = user.userId;
    newFitnessRecord = fitnessDetails;
    console.log("RESULT", newFitnessRecord);
  } else {
    newFitnessRecord.userId = user.userId;
    newFitnessRecord.date = fitnessDetails.date;
    newFitnessRecord.weight = lastFitnessRecord.dataValues.weight;
    newFitnessRecord.height = lastFitnessRecord.dataValues.height;
    newFitnessRecord.mantainanceCalories =
      lastFitnessRecord.dataValues.mantainanceCalories;
    newFitnessRecord.totalDailyCalories =
      lastFitnessRecord.dataValues.totalDailyCalories;
    newFitnessRecord.protein = lastFitnessRecord.dataValues.protein;
    newFitnessRecord.carbs = lastFitnessRecord.dataValues.carbs;
    newFitnessRecord.fats = lastFitnessRecord.dataValues.fats;
    newFitnessRecord.dietType = lastFitnessRecord.dataValues.dietType;
    newFitnessRecord.activityLevel = lastFitnessRecord.dataValues.activityLevel;
    Object.assign(newFitnessRecord, fitnessDetails);
    console.log("OTHER RESULT", newFitnessRecord);
  }
  await models.FitnessDetail.create(newFitnessRecord);
  return newFitnessRecord;
}

// @route  PUT fitnessDetails/latest
// @desc   Update user's latest fitness details
// @access Public
async function updateFitnessRecord(user, req) {
  var fitnessDetails = await models.FitnessDetail.findAll({
    limit: 1,
    where: { userId: user.userId },
    order: [["date", "DESC"]],
  });

  if (!fitnessDetails) throw Error("Fitness details not found");

  var latestFitnessDetails = fitnessDetails[0];

  if (req.body.weight) latestFitnessDetails.update({ weight: req.body.weight });

  if (req.body.height) latestFitnessDetails.update({ height: req.body.height });

  // if (req.body.mantainanceCalories)
  //   latestFitnessDetails.update({
  //     mantainanceCalories: req.body.mantainanceCalories,
  //   });

  // if (req.body.totalDailyCalories)
  //   latestFitnessDetails.update({
  //     totalDailyCalories: req.body.totalDailyCalories,
  //   });

  // if (req.body.protein)
  //   latestFitnessDetails.update({ protein: req.body.protein });

  // if (req.body.carbs) latestFitnessDetails.update({ carbs: req.body.carbs });

  // if (req.body.fats) latestFitnessDetails.update({ fats: req.body.fats });

  if (req.body.dietType)
    latestFitnessDetails.update({ dietType: req.body.dietType });

  // if (req.body.activityLevel)
  //   latestFitnessDetails.update({ protein: req.body.activityLevel });

  await latestFitnessDetails.save();
  return latestFitnessDetails;
}

module.exports = router;
