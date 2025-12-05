const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./src/config/db');
const projectRouter = require('./src/routes/project_routes');
require('dotenv').config(); // << must be at the top

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/projects', projectRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong',
    errors: err.errors || []
  });
});

// Start Server
const PORT = process.env.PORT || 3000; // Use Render's PORT or default to 3000
const HOST = '0.0.0.0'; // Render requires binding to 0.0.0.0

app.listen(PORT, HOST, () => {
    console.log(`Server listening on host ${HOST} and port ${PORT}`);
});