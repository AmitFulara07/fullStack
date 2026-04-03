require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB().then(() => {
  const seedBadges = require('./seeders/badgeSeeder');
  const { initCronJob } = require('./jobs/badgeCronJob');
  seedBadges();
  initCronJob();
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Pre-register models to completely avoid MissingSchemaError in all controllers
require('./models/Project');
require('./models/User');

// Mount Routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/logs', require('./routes/progressLogRoutes'));
app.use('/api/mentor', require('./routes/mentorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Server Error', stack: err.stack });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
