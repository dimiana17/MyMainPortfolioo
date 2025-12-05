const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  link: { type: String, required: true },
  images: [String], // array of image paths
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
