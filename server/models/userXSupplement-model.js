module.exports = (sequelize, DataTypes) => {
  return sequelize.define("usersxsupplements", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    supplementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
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
