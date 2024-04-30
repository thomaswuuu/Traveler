const { Attraction } = require("../models/attractionModel");
const Category = require("../models/categoryModel");
const { Op } = require("sequelize");

const attrationsInfo = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const searchText = req.query.search;
    let attractions;

    // Get attractions by categoryId
    if (Boolean(categoryId) && categoryId != 0) {
      attractions = await Attraction.findAll({
        include: [
          {
            model: Category,
            where: {
              categoryId,
            },
          },
        ],
      });
    } else if (Boolean(searchText)) {
      attractions = await Attraction.findAll({
        where: {
          [Op.or]: {
            name: { [Op.like]: `%${searchText}%` },
            introduction: { [Op.like]: `%${searchText}%` },
          },
        },
      });
    } else {
      attractions = await Attraction.findAll();
    }
    // Get catories
    const categories = await Category.findAll({
      where: {
        categoryId: {
          // 20:北北基景點, 22:借問站, 23:夜市商圈,24:主題商街, 499: 其他
          [Op.not]: ["20", "22", "23", "24", "25", "499"],
        },
      },
    });
    const categoryDetails = categories.map((category) => {
      return {
        id: category.categoryId,
        name: category.name,
      };
    });

    res.render("index", { attractions, categoryDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const attrationsDetail = async (req, res) => {
  try {
    // Get attractions by attractionId
    const attractionId = req.query.id;
    if (Boolean(attractionId)) {
      const attractionDetails = await Attraction.findAll({
        where: {
          attractionId,
        },
      });

      // Get catories
      const categories = await Category.findAll({
        where: {
          categoryId: {
            // 20:北北基景點, 22:借問站, 23:夜市商圈,24:主題商街, 499: 其他
            [Op.not]: ["20", "22", "23", "24", "25", "499"],
          },
        },
      });
      const categoryDetails = categories.map((category) => {
        return {
          id: category.categoryId,
          name: category.name,
        };
      });
      res.render("details", { categoryDetails, attractionDetails });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { attrationsInfo, attrationsDetail };
