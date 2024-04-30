const Category = require("../models/categoryModel");
const axios = require("axios");

const createCategories = async (req, res) => {
  try {
    try {
      const categories_uri = process.env.CATEGORIES_URI;
      const { data } = await axios.get(categories_uri);
      const categoriesArray = data.data.Category;
      // Create category object data list
      const categoryData = await categoriesArray.map((category) => {
        // change id to categoryId
        return { categoryId: category.id, name: category.name };
      });

      // Add additional category
      categoryData.push({ categoryId: 22, name: "借問站" });
      categoryData.push({ categoryId: 499, name: "其他" });

      // Make sure table is created
      await Category.sync();
      // Create category data
      const savedCategories = await Category.bulkCreate(categoryData);
      res.json(savedCategories);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
const getCategories = async (req, res) => {
  try {
    const categoryData = await Category.findAll();
    res.json(categoryData);
  } catch (error) {
    res.json({ message: error.message });
  }
};
const deleteCategories = async (req, res) => {
  try {
    await Category.destroy({
      where: {},
    });
    res.json({ message: "Delete ok!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  createCategories,
  getCategories,
  deleteCategories,
};
