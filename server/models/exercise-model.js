module.exports = (sequelize, DataTypes) => {
  return sequelize.define("exercises", {
    exerciseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["Endurance", "Strength", "Balance", "Flexibility"],
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 30],
      },
      setValue(value) {
        this.setDataValue("name", value.toLowerCase());
      },
    },
    metValue: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error("MET value must be a positive value!");
          }
        },
      },
    },
    targetMuscles: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Please enter target muscles between 3 and 30 characters",
        },
      },
    },
  });
};
