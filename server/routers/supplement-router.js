const express = require("express");
const router = express.Router();
const models = require("../models");

// @route  GET supplements/
// @desc   Get list of all supplements or supplements by type
// @access Public
router.get("/", async (req, res) => {
  try {
    let supplements;
    if (req.query.type) {
      supplements = await models.Supplement.findAll({
        where: {
          type: req.query.type,
        },
        attributes: ["supplementId", "name"],
      });
    } else {
      supplements = await models.Supplement.findAll({
        attributes: ["supplementId", "name"],
      });
    }
    res.status(200).json(supplements);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET supplements/:id
// @desc   Get supplement by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    let supplement = await models.Supplement.findOne({
      where: { supplementId: req.params.id },
    });
    if (!supplement) throw Error("Invalid supplement id");
    res.status(200).json(supplement);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST supplements/
// @desc   Add one supplement or collection of supplements
// @access Public
router.post("/", async (req, res) => {
  try {
    let supplement = req.body;
    let ok = 0;
    if (req.query.bulk && req.query.bulk == "on") {
      supplement.forEach((item) => {
        if (
          !item.name ||
          !item.type ||
          !item.benefit ||
          !item.measureUnit ||
          !item.caloriesPerUnit ||
          !item.proteinPerUnit ||
          !item.carbsPerUnit ||
          !item.fatsPerUnit
        ) {
          ok = 1;
        }
      });
      if (ok == 1) throw Error("Invalid supplements payload");

      await models.Supplement.bulkCreate(supplement);
      return res.status(201).json({ message: "Added supplements succesfully" });
    }
    if (
      !supplement.name ||
      !supplement.type ||
      !supplement.benefit ||
      !supplement.measureUnit ||
      !supplement.caloriesPerUnit ||
      !supplement.proteinPerUnit ||
      !supplement.carbsPerUnit ||
      !supplement.fatsPerUnit
    )
      throw Error("Invalid supplement payload");

    await models.Supplement.create(supplement);
    return res.status(201).json({ message: "Added supplement succesfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT supplements/:id
// @desc   Update one supplement
// @access Public
router.put("/:id", async (req, res) => {
  try {
    let supplement = await models.Supplement.findOne({
      where: { supplementId: req.params.id },
    });
    if (!supplement) throw Error("Supplement not found");

    if (req.body.name) supplement.update({ name: req.body.name });

    if (req.body.type) supplement.update({ type: req.body.type });

    if (req.body.benefit) supplement.update({ benefit: req.body.benefit });

    if (req.body.measureUnit)
      supplement.update({ measureUnit: req.body.measureUnit });

    if (req.body.caloriesPerUnit)
      supplement.update({ caloriesPerUnit: req.body.caloriesPerUnit });

    if (req.body.proteinPerUnit)
      supplement.update({ proteinPerUnit: req.body.proteinPerUnit });

    if (req.body.carbsPerUnit)
      supplement.update({ carbsPerUnit: req.body.carbsPerUnit });

    if (req.body.fatsPerUnit)
      supplement.update({ fatsPerUnit: req.body.fatsPerUnit });

    await supplement.save();
    res.status(201).json({ message: "Supplement updated successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE supplements/:id
// @desc   Delete one supplement
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    models.Supplement.destroy({ where: { supplementId: req.params.id } })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: "Supplement deleted succesfully" });
        } else {
          res.status(200).json({
            message: "No record found matching the supplement id provided",
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
