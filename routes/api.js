const express = require("express");
const categoryCtrl = require("../controllers/categoryController");
const attractionCtrl = require("../controllers/attractionController");
const router = express.Router();

router.get("/category", categoryCtrl.getCategories);
router.post("/category", categoryCtrl.createCategories);
router.delete("/category", categoryCtrl.deleteCategories);

router.get("/attraction", attractionCtrl.getAttractions);
router.post("/attraction", attractionCtrl.createAttractions);
router.delete("/attraction", attractionCtrl.deleteAttractions);

module.exports = router;
