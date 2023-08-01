module.exports = (sequelize, DataTypes) => {
  return sequelize.define("fitnessdetails", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidWeight(value) {
          if (
            parseInt(value.match(/[a-zA-Z]+|[0-9]+/g)[0]) < 30 ||
            parseInt(value.match(/[a-zA-Z]+|[0-9]+/g)[0]) > 300
          ) {
            throw new Error(
              "Please provide a valid weight between 30 and 300 kgs"
            );
          }
        },
      },
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidHeight(value) {
          if (
            parseInt(value.match(/[a-zA-Z]+|[0-9]+/g)[0]) < 100 ||
            parseInt(value.match(/[a-zA-Z]+|[0-9]+/g)[0]) > 250
          ) {
            throw new Error(
              "Please provide a valid height between 100 and 250 cms"
            );
          }
        },
      },
    },
    mantainanceCalories: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("Mantainance calories must be a positive value!");
          }
        },
      },
    },
    totalDailyCalories: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("Total daily calories must be a positive value!");
          }
        },
      },
    },
    protein: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("Protein number must be a positive value!");
          }
        },
      },
    },
    carbs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("Carbs number must be a positive value!");
          }
        },
      },
    },
    fats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("Fats number must be a positive value!");
          }
        },
      },
    },
    dietType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["vegan", "sugar free", "flexible"],
    },
    activityLevel: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["sedentary", "moderate", "intense"],
    },
  });
};
