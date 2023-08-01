module.exports = (sequelize, DataTypes) => {
  return sequelize.define("usersxobjectives", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    objectiveId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true,
    },
    dateStop: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    objectiveWeight: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidWeight(value) {
          if (
            parseInt(value.match(/[a-zA-Z]+|[0-9]+/g)[0]) < 40 ||
            parseInt(value.match(/[a-zA-Z]+|[0-9]+/g)[0]) > 300
          ) {
            throw new Error(
              "Objective weight in kgs must be between 40 and 300"
            );
          }
        },
      },
    },
    isCurrentObjective: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    progressPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  });
};
