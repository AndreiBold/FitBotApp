module.exports = (sequelize, DataTypes) => {
  return sequelize.define("foods", {
    foodId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Please enter a food name between 2 and 30 characters",
        },
      },
      setValue(value) {
        this.setDataValue("name", value.toLowerCase());
      },
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [
        "Vegetables",
        "PlantsFruits",
        "Fungi",
        "NutsSeeds",
        "GrainProducts",
        "AnimalProducts",
        "Condiments",
        "ProcessedFoods",
        "Beverages",
      ],
    },
    measureUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 15],
          msg: "Please enter a measure unit between 2 and 15 characters",
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
