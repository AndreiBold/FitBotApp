module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Please enter a first name between 2 and 30 characters",
        },
      },
      setValue(value) {
        this.setDataValue("firstName", value[0].toUpperCase() + value.slice(1));
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Please enter a surname between 2 and 30 characters",
        },
      },
      setValue(value) {
        this.setDataValue("lastName", value[0].toUpperCase() + value.slice(1));
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: {
          args: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
          msg: "Please enter a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    securityAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "Please enter a name place between 2 and 30 characters",
        },
      },
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["Male", "Female"],
    },
    userType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["User", "Admin"],
      defaultValue: "User",
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordExpires: {
      type: DataTypes.BIGINT,
    },
  });
};
