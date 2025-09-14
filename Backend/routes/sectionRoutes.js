const express = require("express");
const router = express.Router();
const {
  createSection,
  getAllSections,
  editSectionById,
  deleteSection,
} = require("../controllers/sectionController");

router.post("/", createSection);

router.get("/", getAllSections);

router.put("/:id", editSectionById);

router.delete("/:id", deleteSection);

module.exports = router;
