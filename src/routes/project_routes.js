const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Import Project model
const Project = require('../models/Project'); // <- mongoose model

// POST project
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, link } = req.body;

    if (!title || !description || !category || !link) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure files exist
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    // Save in MongoDB
    const project = await Project.create({ title, description, category, link, images });

    res.json({ message: 'Project added', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET projects
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let projects;
    if (category) {
      projects = await Project.find({ category });
    } else {
      projects = await Project.find();
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
