const Gallery = require('../models/gallery');

// Get all gallery items
const getGalleryItems = (req, res) => {
  Gallery.getAll((err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch gallery items' });
    }

    // Prepend /uploads/ to the image filename for the relative URL
    const formattedItems = items.map(row => ({
      id: row.id,
      image: `/uploads/${row.image.trim()}`,
      title: row.title,
      description: row.description,
      category: row.category,
    }));

    res.json(formattedItems);
  });
};

// Add a new gallery item
const addGalleryItem = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const data = {
    image: req.file.filename,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category || null, // Category can be null
  };

  Gallery.create(data, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding gallery item', error: err });
    }
    res.status(201).json({ message: 'Gallery item added successfully', data: result });
  });
};

// Edit an existing gallery item
const editGalleryItem = (req, res) => {
  const { id } = req.params;

  if (!req.file && !req.body.image) {
    return res.status(400).json({ message: 'No image file or image path provided' });
  }

  const data = {
    image: req.file ? req.file.filename : req.body.image,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category || null,
  };

  Gallery.update(id, data, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating gallery item', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Gallery item updated successfully' });
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  });
};

// Delete a gallery item
const deleteGalleryItem = (req, res) => {
  const { id } = req.params;

  Gallery.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting gallery item', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Gallery item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  });
};

module.exports = { getGalleryItems, addGalleryItem, editGalleryItem, deleteGalleryItem };
