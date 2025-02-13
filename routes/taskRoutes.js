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
    const task = new Task(req.body);
    const savedTask = await task.save();

    // Send the task to the second app
    const secondAppUrl = 'https://task-calender-backend-git-main-nithin2023-creators-projects.vercel.app/tasks'; // Replace with your second app's URL
    await axios.post(secondAppUrl, {
      date: savedTask.dueDate.split('T')[0], // Extract the date (YYYY-MM-DD)
      category: savedTask.category || 'General', // Default category
      title: savedTask.title,
      description: savedTask.description,
    });

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to forward request',
      error: error.response ? error.response.data : error.message
    });
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
