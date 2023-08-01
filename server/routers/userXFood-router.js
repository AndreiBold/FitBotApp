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

// @route  GET usersXFoods/foods
// @desc   Get user's list of foods by date
// @access Private
router.get("/foods", auth, async (req, res) => {
  try {
    var result = {};
    var fitnessDetails;
    var defaultData = {};
    let userdata = await models.FitnessDetail.findAll({
      limit: 1,
      where: {
        userId: req.user.userId,
        date: { [Op.lte]: req.query.date },
      },
      order: [["date", "DESC"]],
      attributes: ["totalDailyCalories", "protein", "carbs", "fats"],
    });
    console.log("USERDATA", userdata);

    if (!userdata[0]) {
      defaultData.totalDailyCalories = 0;
      defaultData.protein = 0;
      defaultData.carbs = 0;
      defaultData.fats = 0;
      fitnessDetails = defaultData;
    } else {
      fitnessDetails = userdata[0];
    }

    result.foods = [];
    var userxfoods;
    if (req.query.date) {
      userxfoods = await models.UserXFood.findAll({
        where: {
          userId: req.user.userId,
          dateTime: { [Op.startsWith]: req.query.date },
        },
        attributes: ["mealNumber", "noUnits", "dateTime", "details", "foodId"],
      });
    } else {
      userxfoods = await models.UserXFood.findAll({
        where: {
          userId: req.user.userId,
        },
        attributes: ["mealNumber", "noUnits", "dateTime", "details", "foodId"],
      });
    }
    for (var i = 0; i < userxfoods.length; i++) {
      var foodItem = {};
      var currentFood = userxfoods[i];
      foodItem.userfoodData = currentFood;
      var food = await models.Food.findOne({
        where: currentFood.foodId,
        attributes: [
          "name",
          "measureUnit",
          "caloriesPerUnit",
          "proteinPerUnit",
          "carbsPerUnit",
          "fatsPerUnit",
        ],
      });
      foodItem.foodDetails = food;
      result.foods.push(foodItem);
    }
    var userfoodList = result.foods;

    console.log("TEST", fitnessDetails);

    res.status(200).json({ fitnessDetails, userfoodList });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  POST usersXFoods/food/:fid
// @desc   Add one food to user's journal
// @access Private
router.post("/food/:fid", auth, async (req, res) => {
  let userfood = req.body;
  if (!userfood.mealNumber || !userfood.noUnits || !userfood.details)
    return res.status(400).json({ message: "Please complete all fields" });
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let food = await models.Food.findOne({
      where: { foodId: req.params.fid },
      attributes: [
        "name",
        "measureUnit",
        "caloriesPerUnit",
        "proteinPerUnit",
        "carbsPerUnit",
        "fatsPerUnit",
      ],
    });
    if (!food) throw Error("Food not found");

    let existingUserfood = await models.UserXFood.findOne({
      where: {
        userId: user.userId,
        foodId: req.params.fid,
        mealNumber: userfood.mealNumber,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    if (existingUserfood)
      throw Error("You cannot add the same food twice for the same meal");

    userfood.userId = user.userId;
    userfood.foodId = parseInt(req.params.fid);
    await models.UserXFood.create(userfood);
    let userfoodItem = {};
    userfoodItem.userfoodData = userfood;
    userfoodItem.foodDetails = food;
    res.status(201).json({
      userfoodItem,
      message: "Added supplement successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  POST usersXFoods/food/
// @desc   Let Jarvis add one food to user's journal
// @access Private
router.post("/food/", auth, async (req, res) => {
  let userfood = req.body;
  if (!userfood.mealNumber || !userfood.noUnits || !userfood.details)
    return res.status(400).json({ message: "Please complete all fields" });
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let food = await models.Food.findOne({
      where: { name: req.query.name },
    });
    if (!food) throw Error("Food not found");

    let existingUserfood = await models.UserXFood.findOne({
      where: {
        userId: user.userId,
        foodId: food.foodId,
        mealNumber: userfood.mealNumber,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    if (existingUserfood)
      throw Error("You cannot add the same food twice for the same meal");

    userfood.userId = user.userId;
    userfood.foodId = food.foodId;
    await models.UserXFood.create(userfood);
    let userfoodItem = {};
    userfoodItem.userfoodData = userfood;
    userfoodItem.foodDetails = food;
    res.status(201).json({
      userfoodItem,
      message: "Added food successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  PUT usersXFoods/food/:fid/:dateTime
// @desc   Update one food from user's journal
// @access Private
router.put("/food/:fid/:dateTime", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let food = await models.Food.findOne({
      where: { foodId: req.params.fid },
      attributes: [
        "name",
        "measureUnit",
        "caloriesPerUnit",
        "proteinPerUnit",
        "carbsPerUnit",
        "fatsPerUnit",
      ],
    });
    if (!food) throw Error("Food not found");

    let userfood = await models.UserXFood.findOne({
      where: {
        userId: user.userId,
        foodId: req.params.fid,
        dateTime: req.params.dateTime,
      },
    });
    if (!userfood) throw Error("Invalid payload");

    await userfood.update(req.body, {
      fields: ["mealNumber", "noUnits", "details"],
    });
    let userfoodItem = {};
    userfoodItem.userfoodData = userfood;
    userfoodItem.foodDetails = food;
    let foodId = userfood.foodId;
    let dateTime = userfood.dateTime;
    res.status(201).json({
      foodId,
      dateTime,
      userfoodItem,
      message: "Updated food successfully to the journal",
    });
  } catch (e) {
    if (e.message.charAt(0) === "V")
      return res.status(400).json({ message: e.message.split(": ")[1] });
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE usersXFoods/food/:fid/:dateTime
// @desc   Delete one food from user's journal
// @access Private
router.delete("/food/:fid/:dateTime", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let food = await models.Food.findByPk(req.params.fid);
    if (!food) throw Error("Food not found");

    let userfood = await models.UserXFood.findOne({
      where: {
        userId: user.userId,
        foodId: food.foodId,
        dateTime: req.params.dateTime,
      },
    });

    let foodId = userfood.foodId;
    let dateTime = userfood.dateTime;

    if (!userfood) throw Error("Invalid payload");
    await userfood.destroy(req.body);
    res.status(201).json({
      foodId,
      dateTime,
      message: "Removed food successfully from the journal",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// @route  DELETE usersXFoods/food/
// @desc   Let Jarvis delete one food from user's journal
// @access Private
router.delete("/food/", auth, async (req, res) => {
  try {
    let user = await models.User.findByPk(req.user.userId);
    if (!user) throw Error("User not found");

    let food = await models.Food.findOne({
      where: { name: req.query.name },
    });
    if (!food) throw Error("Food not found");

    let userfood = await models.UserXFood.findOne({
      where: {
        userId: user.userId,
        foodId: food.foodId,
        mealNumber: req.query.mealNumber,
        dateTime: { [Op.like]: simpleFormatDate(new Date()) + "%" },
      },
    });

    let foodId = userfood.foodId;
    let dateTime = userfood.dateTime;

    if (!userfood) throw Error("Invalid payload");
    await userfood.destroy(req.body);
    res.status(201).json({
      foodId,
      dateTime,
      message: "Removed food successfully from the journal",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
