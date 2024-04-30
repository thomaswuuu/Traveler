const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Attraction } = require("../models/attractionModel");

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileID: {
      type: DataTypes.STRING,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Middle table between user and attraction
const UserAttraction = sequelize.define(
  "UserAttractoin",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    attractionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Define table relations between User and Attraction
User.belongsToMany(Attraction, {
  through: UserAttraction,
  foreignKey: "userId",
});

Attraction.belongsToMany(User, {
  through: UserAttraction,
  foreignKey: "attractionId",
});

module.exports = { User, UserAttraction };
