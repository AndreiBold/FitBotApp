const express = require("express");
const router = express.Router();
const models = require("../models");

// @route  GET foods/
// @desc   Get list of all foods or foods by type
// @access Public
router.get("/", async (req, res) => {
  try {
    let foods;
    if (req.query.type) {
      foods = await models.Food.findAll({
        where: {
          type: req.query.type,
        },
        attributes: ["foodId", "name"],
      });
    } else {
      foods = await models.Food.findAll({
        attributes: ["foodId", "name"],
      });
    }
    res.status(200).json(foods);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET foods/:id
// @desc   Get food by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    let food = await models.Food.findOne({
      where: { foodId: req.params.id },
    });
    if (!food) throw Error("Invalid food id");
    res.status(200).json(food);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST foods/
// @desc   Add one food or collection of foods
// @access Public
router.post("/", async (req, res) => {
  try {
    let food = req.body;
    let ok = 0;
    if (req.query.bulk && req.query.bulk == "on") {
      food.forEach((item) => {
        if (
          !item.name ||
          !item.type ||
          !item.measureUnit ||
          !item.caloriesPerUnit ||
          !item.proteinPerUnit ||
          !item.carbsPerUnit ||
          !item.fatsPerUnit
        ) {
          ok = 1;
        }
      });
      if (ok == 1) throw Error("Invalid foods payload");

      await models.Food.bulkCreate(food);
      return res.status(201).json({ message: "Added foods succesfully" });
    }
    if (
      !food.name ||
      !food.type ||
      !food.measureUnit ||
      !food.caloriesPerUnit ||
      !food.proteinPerUnit ||
      !food.carbsPerUnit ||
      !food.fatsPerUnit
    )
      throw Error("Invalid food payload");

    await models.Food.create(food);
    return res.status(201).json({ message: "Added food succesfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT foods/:id
// @desc   Update one food
// @access Public
router.put("/:id", async (req, res) => {
  try {
    let food = await models.Food.findOne({
      where: { foodId: req.params.id },
    });
    if (!food) throw Error("Food not found");

    if (req.body.name) food.update({ name: req.body.name });

    if (req.body.type) food.update({ type: req.body.type });

    if (req.body.measureUnit)
      food.update({ measureUnit: req.body.measureUnit });

    if (req.body.caloriesPerUnit)
      food.update({ caloriesPerUnit: req.body.caloriesPerUnit });

    if (req.body.proteinPerUnit)
      food.update({ proteinPerUnit: req.body.proteinPerUnit });

    if (req.body.carbsPerUnit)
      food.update({ carbsPerUnit: req.body.carbsPerUnit });

    if (req.body.fatsPerUnit)
      food.update({ fatsPerUnit: req.body.fatsPerUnit });

    await food.save();
    res.status(201).json({ message: "Food updated successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE foods/:id
// @desc   Delete one food
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    models.Food.destroy({ where: { foodId: req.params.id } })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: "Food deleted succesfully" });
        } else {
          res.status(200).json({
            message: "No record found matching the food id provided",
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
