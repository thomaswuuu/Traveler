const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.attrationsInfo);
router.get("/details", controller.attrationsDetail);

module.exports = router;
