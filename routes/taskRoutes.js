const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

// Get a task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
});

// Create a new task




router.post('/', async (req, res) => {
  try {
    // Extract fields from request body
    const { date, category, title, description } = req.body;
    console.log('testingfrombackend','req.body)',req.body);
    // Validate required fields
    if (!date || !category || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields: date, category, title, description' });
    }

    // Send request to the external API
    const response = await axios.post(
      'https://task-calender-backend-git-main-nithin2023-creators-projects.vercel.app/tasks',
      { date, category, title, description }, // Ensuring correct structure
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Send the response back to the client
    res.status(201).json({ message: 'Task added successfully', data: response.data });

  } catch (error) {
    console.error('Error adding task:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to add task', details: error.response ? error.response.data : error.message });
  }
});





// Update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

module.exports = router;
