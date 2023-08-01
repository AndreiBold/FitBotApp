module.exports = (sequelize, DataTypes) => {
  return sequelize.define("supplements", {
    supplementId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["VitaminsMinerals", "Powders"],
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Please enter a supplement name between 3 and 30 characters",
        },
      },
      setValue(value) {
        this.setDataValue("name", value.toLowerCase());
      },
    },
    benefit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Please enter a benefit between 3 and 30 characters",
        },
      },
    },
    measureUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Please enter a measure unit between 3 and 30 characters",
        },
      },
    },
    caloriesPerUnit: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (parseFloat(value) < 0) {
            throw new Error("Calories must be a positive value");
          }
        },
      },
    },
    proteinPerUnit: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (parseFloat(value) < 0) {
            throw new Error("Protein must be a positive value");
          }
        },
      },
    },
    carbsPerUnit: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (parseFloat(value) < 0) {
            throw new Error("Carbs must be a positive value");
          }
        },
      },
    },
    fatsPerUnit: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (parseFloat(value) < 0) {
            throw new Error("Fats must be a positive value");
          }
        },
      },
    },
  });
};
