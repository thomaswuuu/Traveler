const {
  Attraction,
  AttractionCategories,
} = require("../models/attractionModel");
const Category = require("../models/categoryModel");
const axios = require("axios");

const storeToDatabase = async (attrationsArray) => {
  try {
    // Create attration data
    const attractionCategoryData = [];
    const attractionData = attrationsArray.map((data) => {
      // Create attraction data
      const attractions = {
        attractionId: data.id,
        name: data.name,
        introduction: data.introduction,
        zipcode: data.zipcode,
        distric: data.distric,
        address: data.address,
        tel: data.tel,
        nlat: data.nlat,
        elong: data.elong,
        images: data.images.map((image) => image.src),
        modifiedAt: data.modified,
      };
      // Create attractionCategory data
      data.category.forEach(async (category) => {
        attractionCategoryData.push({
          attractionId: data.id,
          categoryId: category.id,
        });
      });

      return attractions;
    });
    // Insert each data to corresponding table
    await Attraction.bulkCreate(attractionData);
    await AttractionCategories.bulkCreate(attractionCategoryData);

    return attractionData;
  } catch (error) {
    throw error;
  }
};

const createAttractions = async (req, res) => {
  try {
    const attraction_uri = process.env.ATTRACTIONS_URI;
    const { data } = await axios.get(`${attraction_uri}?page=1`);
    const total = data.total;
    const perPage = 30;
    const totalPage = Math.ceil(total / perPage);

    // Make sure table is created
    await Attraction.sync();
    await AttractionCategories.sync();

    let savedAttractions = await storeToDatabase(data.data);
    for (let page = 2; page <= totalPage; page++) {
      const { data } = await axios.get(`${attraction_uri}?page=${page}`);
      savedAttractions = [...savedAttractions, storeToDatabase(data.data)];
    }

    res.status(201).json({ total, savedAttractions });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const getAttractions = async (req, res) => {
  try {
    let attractionData;
    const zipcode = req.query.zipcode;
    const categoryId = req.query.categoryId;
    if (Boolean(zipcode) && Boolean(categoryId)) {
      attractionData = await Attraction.findAll({
        include: [
          {
            model: Category,
            where: {
              categoryId,
            },
          },
        ],
        where: {
          zipcode,
        },
      });
    } else if (Boolean(zipcode)) {
      attractionData = await Attraction.findAll({
        where: {
          zipcode,
        },
      });
    } else if (Boolean(categoryId)) {
      attractionData = await Attraction.findAll({
        include: [
          {
            model: Category,
            where: {
              categoryId,
            },
          },
        ],
      });
    } else {
      attractionData = await Attraction.findAll();
    }
    res.json(attractionData);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const deleteAttractions = async (req, res) => {
  try {
    await Attraction.destroy({
      where: {},
    });
    await AttractionCategories.destroy({
      where: {},
    });
    res.json({ message: "Delete ok!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { createAttractions, getAttractions, deleteAttractions };
