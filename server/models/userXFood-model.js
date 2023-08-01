module.exports = (sequelize, DataTypes) => {
  return sequelize.define("usersxfoods", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    mealNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error(
              "Meal number must be a positive value greater than 0!"
            );
          }
        },
      },
    },
    noUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error(
              "Number of units must be a positive value greater than 0!"
            );
          }
        },
      },
    },
    details: {
      type: DataTypes.STRING,
    },
  });
};
