const express = require('express');
const router = express.Router();
const { getAwards, addAward, editAward, deleteAward, upload } = require('../controllers/awardController');

// Define award-related routes
router.get('/awards', getAwards);
router.post('/awards', upload.single('image'), addAward);
router.put('/awards', upload.single('image'), editAward);
router.delete('/awards/:id', deleteAward);

module.exports = router;
