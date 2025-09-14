const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const upload = require('../multerConfig'); // Import Multer configuration

// Define routes for gallery management
router.get('/', galleryController.getGalleryItems); // Fetch all gallery items
router.post('/', upload.single('image'), galleryController.addGalleryItem); // Add a new gallery item
router.put('/:id', upload.single('image'), galleryController.editGalleryItem); // Edit an existing gallery item
router.delete('/:id', galleryController.deleteGalleryItem); // Delete a gallery item

module.exports = router;
