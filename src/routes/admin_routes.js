const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Accept up to 5 images
const upload = multer({ storage: storage });

// POST route to add project
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, link } = req.body;
    const images = req.files.map(file => file.filename); // array of filenames

    // Save project to DB here (example)
    const newProject = { title, description, category, link, images };
    
    // Example response
    res.status(201).json({ message: 'Project added', project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: error.message, errors: [] });
  }
});

module.exports = router;
