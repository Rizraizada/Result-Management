// Backend/routes/activitiesRoutes.js
const express = require('express');
const router = express.Router();
const { getActivities, addActivities, upload } = require('../controllers/activitiesController');

router.get('/activities', getActivities);
router.post('/activities', upload.single('image'), addActivities);

module.exports = router;
