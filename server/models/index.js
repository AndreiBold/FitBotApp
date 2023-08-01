const fs = require("fs");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    define: {
      timestamps: false,
    },
    // logging: false,
  }
);

//mapping each model file (except index.js) to it's keyname
let db = {};
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js") {
    let keyName = file.split(".")[0].split("-")[0];
    keyName = keyName[0].toUpperCase() + keyName.slice(1, keyName.length);
    let moduleName = file.split(".")[0];
    db[keyName] = sequelize.import(moduleName);
  }
});

//setting relations between tables
db.User.hasMany(db.UserXFood, {
  foreignKey: "userId",
  target: "userId",
});

db.Food.hasMany(db.UserXFood, {
  foreignKey: "foodId",
  target: "foodId",
});

db.User.hasMany(db.UserXObjective, {
  foreignKey: "userId",
  target: "userId",
});

db.Objective.hasMany(db.UserXObjective, {
  foreignKey: "objectiveId",
  target: "objectiveId",
});

db.User.hasMany(db.FitnessDetail, {
  foreignKey: "userId",
  target: "userId",
});

db.User.hasMany(db.UserXExercise, {
  foreignKey: "userId",
  target: "userId",
});

db.Exercise.hasMany(db.UserXExercise, {
  foreignKey: "exerciseId",
  target: "exerciseId",
});

db.User.hasMany(db.UserXSupplement, {
  foreignKey: "userId",
  target: "userId",
});

db.Supplement.hasMany(db.UserXSupplement, {
  foreignKey: "supplementId",
  target: "supplementId",
});

db.User.hasOne(db.Context, {
  foreignKey: "userId",
  target: "userId",
});

//create tables
//sequelize.sync({ force: true });

module.exports = db;
