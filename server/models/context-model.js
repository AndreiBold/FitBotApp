module.exports = (sequelize, DataTypes) => {
  return sequelize.define("contexts", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
};
