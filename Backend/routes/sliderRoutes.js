const express = require('express');
const router = express.Router();
const { getSliderImages, addSlider, editSlider, deleteSlider, upload } = require('../controllers/sliderController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Slider routes restricted to teacher role
router.get('/sliders', getSliderImages);
router.post('/sliders', upload.single('image'), addSlider);
router.put('/sliders', upload.single('image'), editSlider);
router.delete('/sliders/:id', deleteSlider);

module.exports = router;
