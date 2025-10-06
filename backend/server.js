const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

// ✅ Load .env if it exists
if (fs.existsSync('.env')) {
  dotenv.config();
  console.log('✅ .env file loaded');
} else {
  console.error('❌ .env file not found');
}

// ✅ Debug log to confirm port is loaded
console.log('🌐 PORT from .env:', process.env.PORT);

const app = express();

// ✅ Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/jobs', require('./src/routes/jobRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler middleware
app.use(errorHandler);

// Server listen
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
