const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./categoryModel");

const Attraction = sequelize.define(
  "Attraction",
  {
    attractionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    introduction: {
      type: DataTypes.TEXT,
    },
    zipcode: {
      type: DataTypes.INTEGER,
    },
    distric: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    tel: {
      type: DataTypes.STRING,
    },
    nlat: {
      type: DataTypes.DOUBLE,
    },
    elong: {
      type: DataTypes.DOUBLE,
    },

    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    modifiedAt: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, // Prevent to create column createdAt and updatedAt
    freezeTableName: true,
  }
);

// Middle table between Attraction and Category
const AttractionCategories = sequelize.define(
  "AttractionCategories",
  {
    attractionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: Attraction,
        key: "attractionId",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: Category,
        key: "categoryId",
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Define table relations between Attraction and Category
Attraction.belongsToMany(Category, {
  through: AttractionCategories,
  foreignKey: "attractionId",
});
Category.belongsToMany(Attraction, {
  through: AttractionCategories,
  foreignKey: "categoryId",
});

module.exports = {
  Attraction,
  AttractionCategories,
};
