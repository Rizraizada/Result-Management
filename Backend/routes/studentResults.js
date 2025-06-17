const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentResultsController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Basic CRUD routes
router.get('/', controller.getAll);
router.post('/', controller.insertResult);
router.put('/:id', controller.updateResult);
router.delete('/:id', controller.deleteResult);

// Search and filter routes
router.get('/by-identifier', controller.getByIdentifier);
router.post('/strict-search', controller.strictSearch);
router.get('/search', controller.searchFlexible);
router.get('/by-class-year', controller.getByClassAndYear);
router.get('/grouped-summary', controller.getGroupedSummary);

// Excel file upload route
router.post('/upload', upload.single('excel'), controller.processExcelUpload);

// Bulk insert route (for programmatic use)
router.post('/bulk', controller.bulkInsertResults);

module.exports = router;