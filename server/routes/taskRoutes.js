const express = require('express');
const router = express.Router();
const TaskService = require('../services/taskService');
const { requireUser } = require('./middleware/auth');

// Create a new task
router.post('/', requireUser, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || !description) {
      return res.status(400).json({
        error: 'Name and description are required'
      });
    }

    const task = await TaskService.create({ name, description }, userId);
    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks for the authenticated user
router.get('/', requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await TaskService.list(userId);
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update task status
router.put('/:id/status', requireUser, async (req, res) => {
  console.log('Received status update request:', {
    taskId: req.params.id,
    status: req.body.status,
    userId: req.user.id,
    headers: req.headers
  });

  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !['Pending', 'Completed', 'Done'].includes(status)) {
      console.log('Invalid status value:', status);
      return res.status(400).json({
        error: 'Invalid status value'
      });
    }

    const task = await TaskService.updateStatus(id, status, userId);
    console.log('Successfully updated task:', task);
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
    const userId = req.user.id;
    await TaskService.delete(id, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;