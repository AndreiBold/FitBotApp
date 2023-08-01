module.exports = (sequelize, DataTypes) => {
  return sequelize.define("objectives", {
    objectiveId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
  });
};
