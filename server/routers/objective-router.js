const express = require("express");
const router = express.Router();
const models = require("../models");

// @route  GET objectives/
// @desc   Get list of all objectives
// @access Public
router.get("/", async (req, res) => {
  try {
    let objectives;
    objectives = await models.Objective.findAll({
      attributes: ["objectiveId", "name"],
    });
    res.status(200).json(objectives);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  GET objectives/:id
// @desc   Get objective by id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    let objective = await models.Objective.findOne({
      where: { objectiveId: req.params.id },
    });
    if (!objective) throw Error("Invalid objective id");
    res.status(200).json(objective);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST objectives/
// @desc   Add one objective or collection of objectives
// @access Public
router.post("/", async (req, res) => {
  try {
    let objective = req.body;
    let ok = 0;
    if (req.query.bulk && req.query.bulk == "on") {
      objective.forEach((item) => {
        if (!item.name) ok = 1;
      });
      if (ok == 1) throw Error("Invalid foods payload");

      await models.Objective.bulkCreate(objective);
      return res.status(201).json({ message: "Added objectives succesfully" });
    }
    if (!objective.name) throw Error("Invalid objective payload");

    await models.Objective.create(objective);
    return res.status(201).json({ message: "Added objective succesfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT objectives/:id
// @desc   Update one objective
// @access Public
router.put("/:id", async (req, res) => {
  try {
    let objective = await models.Objective.findOne({
      where: { objectiveId: req.params.id },
    });
    if (!objective) throw Error("Objective not found");

    if (req.body.name) objective.update({ name: req.body.name });

    await objective.save();
    res.status(201).json({ message: "Objective updated successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE objectives/:id
// @desc   Delete one objective
// @access Public
router.delete("/:id", async (req, res) => {
  try {
    models.Objective.destroy({ where: { objectiveId: req.params.id } })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: "Objective deleted succesfully" });
        } else {
          res.status(200).json({
            message: "No record found matching the objective id provided",
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
