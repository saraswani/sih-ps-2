const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mospi_skill_intelligence';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MoSPI AI-Enabled Skill Intelligence & Learning Platform (SIH26101)',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Production Static File Serving (React Vite Bundle)
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      app: 'MoSPI AI-Enabled Skill Intelligence & Learning Platform (SIH26101)',
      version: '1.0.0',
      timestamp: new Date()
    });
  });
}

async function startServer() {
  try {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
      console.log('Connected to MongoDB at:', MONGODB_URI);
    } catch (err) {
      console.log('MongoDB connection fallback: Using built-in in-memory dataset store.');
    }

    app.listen(PORT, () => {
      console.log(`MoSPI Backend API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
  }
}

startServer();
