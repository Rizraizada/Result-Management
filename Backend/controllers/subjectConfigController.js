const SubjectConfig = require("../models/SubjectConfig");

// Get all configs
const getAllConfigs = async (req, res) => {
  try {
    const configs = await SubjectConfig.getAll();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by class
const getConfigsByClass = async (req, res) => {
  try {
    const { classLevel } = req.params;
    const configs = await SubjectConfig.getByClass(classLevel);
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by class + group
const getConfigsByClassAndGroup = async (req, res) => {
  try {
    const { classLevel, groupName } = req.params;
    const configs = await SubjectConfig.getByClassAndGroup(classLevel, groupName);
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new config
const createConfig = async (req, res) => {
  try {
    const newConfig = await SubjectConfig.create(req.body);
    res.status(201).json(newConfig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update config
const updateConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedConfig = await SubjectConfig.update(id, req.body);
    res.json(updatedConfig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete config
const deleteConfig = async (req, res) => {
  try {
    const { id } = req.params;
    await SubjectConfig.delete(id);
    res.json({ message: "Config deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllConfigs,
  getConfigsByClass,
  getConfigsByClassAndGroup,
  createConfig,
  updateConfig,
  deleteConfig,
};
