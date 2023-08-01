module.exports = (sequelize, DataTypes) => {
  return sequelize.define("usersxexercises", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    exerciseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    workoutNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error(
              "Workout number must be a positive value greater than 0!"
            );
          }
        },
      },
    },
    minutesDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("Please enter a positive duration in minutes!");
          }
        },
      },
    },
    details: {
      type: DataTypes.STRING,
    },
  });
};
