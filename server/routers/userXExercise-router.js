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

// @route  GET usersXExercises/exercises
// @desc   Get user's list of exercises by date
// @access Private
router.get("/exercises", auth, async (req, res) => {
  try {
    var result = {};
    var extractedUserWeight;
    let userdata = await models.FitnessDetail.findAll({
      limit: 1,
      where: {
        userId: req.user.userId,
        date: { [Op.lte]: req.query.date },
      },
      order: [["date", "DESC"]],
      attributes: ["weight"],
    });

    if (!userdata[0]) {
      extractedUserWeight = 0;
    } else {
      extractedUserWeight = parseInt(
        userdata[0].dataValues.weight.match(/[a-zA-Z]+|[0-9]+/g)[0]
      );
    }

    result.exercises = [];
    var userxexercises;
    if (req.query.date) {
      userxexercises = await models.UserXExercise.findAll({
        where: {
          userId: req.user.userId,
          dateTime: { [Op.startsWith]: req.query.date },
        },
        attributes: [
          "dateTime",
          "workoutNumber",
          "minutesDuration",
          "details",
          "exerciseId",
        ],
      });
    } else {
      userxexercises = await models.UserXExercise.findAll({
        where: {
          userId: req.user.userId,
        },
        attributes: [
          "dateTime",
          "workoutNumber",
          "minutesDuration",
          "details",
          "exerciseId",
        ],
      });
    }
    for (var i = 0; i < userxexercises.length; i++) {
      var exerciseItem = {};
      var currentExercise = userxexercises[i];
      exerciseItem.userexerciseData = currentExercise;
      var exercise = await models.Exercise.findOne({
        where: currentExercise.exerciseId,
        attributes: ["name", "metValue", "targetMuscles"],
      });
      exerciseItem.exerciseDetails = exercise;

      result.exercises.push(exerciseItem);
    }
    var userexerciseList = result.exercises;
    res.status(200).json({ extractedUserWeight, userexerciseList });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST usersXExercises/exercise/:eid
// @desc   Add one exercise to user's journal
// @access Private
router.post("/exercise/:eid", auth, async (req, res) => {
  let userexercise = req.body;
  if (
    !userexercise.workoutNumber ||
    !userexercise.minutesDuration ||
    !userexercise.details
  )
    return res.status(400).json({ message: "Please complete all fields" });
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let exercise = await models.Exercise.findOne({
      where: { exerciseId: req.params.eid },
      attributes: ["name", "metValue", "targetMuscles"],
    });
    if (!exercise) throw Error("Exercise not found");

    let existingUserexercise = await models.UserXExercise.findOne({
      where: {
        userId: user.userId,
        exerciseId: req.params.eid,
        workoutNumber: userexercise.workoutNumber,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    if (existingUserexercise)
      throw Error(
        "You cannot add the same exercise twice for the same workout"
      );

    userexercise.userId = user.userId;
    userexercise.exerciseId = parseInt(req.params.eid);
    await models.UserXExercise.create(userexercise);
    let userexerciseItem = {};
    userexerciseItem.userexerciseData = userexercise;
    userexerciseItem.exerciseDetails = exercise;
    res.status(201).json({
      userexerciseItem,
      message: "Added exercise successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  POST usersXExercises/exercise/
// @desc   Let Jarvis add one exercise to user's journal
// @access Private
router.post("/exercise/", auth, async (req, res) => {
  let userexercise = req.body;
  if (
    !userexercise.workoutNumber ||
    !userexercise.minutesDuration ||
    !userexercise.details
  )
    return res.status(400).json({ message: "Please complete all fields" });
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let exercise = await models.Exercise.findOne({
      where: { name: req.query.name },
    });
    if (!exercise) throw Error("Exercise not found");

    let existingUserexercise = await models.UserXExercise.findOne({
      where: {
        userId: user.userId,
        exerciseId: exercise.exerciseId,
        workoutNumber: userexercise.workoutNumber,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    if (existingUserexercise)
      throw Error(
        "You cannot add the same exercise twice for the same workout"
      );

    userexercise.userId = user.userId;
    userexercise.exerciseId = exercise.exerciseId;
    await models.UserXExercise.create(userexercise);
    let userexerciseItem = {};
    userexerciseItem.userexerciseData = userexercise;
    userexerciseItem.exerciseDetails = exercise;
    res.status(201).json({
      userexerciseItem,
      message: "Added exercise successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT usersXExercises/exercise/:eid/:dateTime
// @desc   Update one exercise from user's journal
// @access Private
router.put("/exercise/:eid/:dateTime", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let exercise = await models.Exercise.findOne({
      where: { exerciseId: req.params.eid },
      attributes: ["name", "metValue", "targetMuscles"],
    });
    if (!exercise) throw Error("Exercise not found");

    let userexercise = await models.UserXExercise.findOne({
      where: {
        userId: user.userId,
        exerciseId: req.params.eid,
        dateTime: req.params.dateTime,
      },
    });
    if (!userexercise) throw Error("Invalid payload");

    await userexercise.update(req.body, {
      fields: ["workoutNumber", "minutesDuration", "details"],
    });
    let userexerciseItem = {};
    userexerciseItem.userexerciseData = userexercise;
    userexerciseItem.exerciseDetails = exercise;
    let exerciseId = userexercise.exerciseId;
    let dateTime = userexercise.dateTime;
    res.status(201).json({
      exerciseId,
      dateTime,
      userexerciseItem,
      message: "Updated exercise successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE usersXExercises/exercise/:eid/:dateTime
// @desc   Delete one exercise from user's journal
// @access Private
router.delete("/exercise/:eid/:dateTime", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let exercise = await models.Exercise.findByPk(req.params.eid);
    if (!exercise) throw Error("Exercise not found");

    let userexercise = await models.UserXExercise.findOne({
      where: {
        userId: user.userId,
        exerciseId: exercise.exerciseId,
        dateTime: req.params.dateTime,
      },
    });

    let exerciseId = userexercise.exerciseId;
    let dateTime = userexercise.dateTime;

    if (!userexercise) throw Error("Invalid payload");
    await userexercise.destroy(req.body);
    res.status(201).json({
      exerciseId,
      dateTime,
      message: "Removed exercise successfully from the journal",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE usersXExercises/exercise/
// @desc   Let Jarvis delete one exercise from user's journal
// @access Private
router.delete("/exercise/", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let exercise = await models.Exercise.findOne({
      where: { name: req.query.name },
    });
    if (!exercise) throw Error("Exercise not found");

    let userexercise = await models.UserXExercise.findOne({
      where: {
        userId: user.userId,
        exerciseId: exercise.exerciseId,
        workoutNumber: req.query.workoutNumber,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    let exerciseId = userexercise.exerciseId;
    let dateTime = userexercise.dateTime;

    if (!userexercise) throw Error("Invalid payload");
    await userexercise.destroy(req.body);
    res.status(201).json({
      exerciseId,
      dateTime,
      message: "Removed exercise successfully from the journal",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
