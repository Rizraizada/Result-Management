const express = require("express");
const router = express.Router();
const subjectConfigController = require("../controllers/subjectConfigController");

// CRUD
router.get("/", subjectConfigController.getAllConfigs);
router.get("/class/:classLevel", subjectConfigController.getConfigsByClass);
router.get("/class/:classLevel/group/:groupName", subjectConfigController.getConfigsByClassAndGroup);
router.post("/", subjectConfigController.createConfig);
router.put("/:id", subjectConfigController.updateConfig);
router.delete("/:id", subjectConfigController.deleteConfig);

module.exports = router;
