const express = require('express');
const router = express.Router();
const TaskService = require('../services/taskService');
const { requireUser } = require('./middleware/auth');

// Create a new task
router.post('/', requireUser, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: 'Name and description are required'
      });
    }

    const task = await TaskService.create({ name, description });
    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
router.get('/', requireUser, async (req, res) => {
  try {
    const tasks = await TaskService.list();
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update task status
router.patch('/:id/status', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Completed', 'Done'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status value'
      });
    }

    const task = await TaskService.updateStatus(id, status);
    res.json({ task });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    await TaskService.delete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;