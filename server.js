// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB with explicit index handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected');
  
  // Drop all indexes and recreate them
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.dropIndexes();
      console.log(`Dropped indexes for ${collection.collectionName}`);
    }
  } catch (err) {
    console.log('Error dropping indexes:', err);
  }
})
.catch((err) => console.error('MongoDB connection failed:', err));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/auth', userRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));