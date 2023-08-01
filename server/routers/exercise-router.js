const express = require("express");
const router = express.Router();
const models = require("../models");

// @route  GET exercises/
// @desc   Get list of all exercises or exercises by type
// @access Public
router.get("/", async (req, res) => {
  try {
    let exercises;
    if (req.query.type) {
      exercises = await models.Exercise.findAll({
        where: {
          type: req.query.type,
        },
        attributes: ["exerciseId", "name"],
      });
    } else {
      exercises = await models.Exercise.findAll({
        attributes: ["exerciseId", "name"],
      });
    }
    res.status(200).json(exercises);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET exercises/:id
// @desc   Get exercise by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    let exercise = await models.Exercise.findOne({
      where: { exerciseId: req.params.id },
    });
    if (!exercise) throw Error("Invalid exercise id");
    res.status(200).json(exercise);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST exercises/
// @desc   Add one exercise or collection of exercises
// @access Public
router.post("/", async (req, res) => {
  try {
    let exercise = req.body;
    let ok = 0;
    if (req.query.bulk && req.query.bulk == "on") {
      exercise.forEach((item) => {
        if (!item.name || !item.type || !item.metValue || !item.targetMuscles) {
          ok = 1;
        }
      });
      if (ok == 1) throw Error("Invalid exercises payload");

      await models.Exercise.bulkCreate(exercise);
      return res.status(201).json({ message: "Added exercises succesfully" });
    }
    if (
      !exercise.name ||
      !exercise.type ||
      !exercise.metValue ||
      !exercise.targetMuscles
    )
      throw Error("Invalid exercise payload");

    await models.Exercise.create(exercise);
    return res.status(201).json({ message: "Added exercise succesfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT exercises/:id
// @desc   Update one exercise
// @access Public
router.put("/:id", async (req, res) => {
  try {
    let exercise = await models.Exercise.findOne({
      where: { exerciseId: req.params.id },
    });
    if (!exercise) throw Error("Exercise not found");

    if (req.body.name) exercise.update({ name: req.body.name });

    if (req.body.type) exercise.update({ type: req.body.type });

    if (req.body.metValue) exercise.update({ metValue: req.body.metValue });

    if (req.body.targetMuscles)
      exercise.update({ targetMuscles: req.body.targetMuscles });

    await exercise.save();
    res.status(201).json({ message: "Exercise updated successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE exercises/:id
// @desc   Delete one exercise
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    models.Exercise.destroy({ where: { exerciseId: req.params.id } })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: "Exercise deleted succesfully" });
        } else {
          res.status(200).json({
            message: "No record found matching the exercise id provided",
          });
        }
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
