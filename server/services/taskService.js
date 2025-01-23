const Task = require('../models/Task');

class TaskService {
  static async create(taskData, userId) {
    try {
      console.log(`Creating new task with name: ${taskData.name} for user: ${userId}`);

      const task = new Task({
        name: taskData.name,
        description: taskData.description,
        status: 'Pending',
        userId
      });

      await task.save();

      console.log(`Successfully created task with ID: ${task._id}`);
      return task;
    } catch (error) {
      console.error('Error in TaskService.create:', error);
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  static async list(userId) {
    try {
      console.log(`Fetching tasks for user: ${userId}`);
      const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
      console.log(`Successfully fetched ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      console.error('Error in TaskService.list:', error);
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  }

  static async updateStatus(taskId, status, userId) {
    try {
      console.log(`Updating task ${taskId} status to: ${status}`);

      const task = await Task.findOne({ _id: taskId, userId });
      if (!task) {
        throw new Error('Task not found or unauthorized');
      }

      task.status = status;
      await task.save();

      console.log(`Successfully updated task ${taskId} status`);
      return task;
    } catch (error) {
      console.error('Error in TaskService.updateStatus:', error);
      throw new Error(`Error updating task status: ${error.message}`);
    }
  }

  static async delete(taskId, userId) {
    try {
      console.log(`Deleting task with ID: ${taskId}`);

      const task = await Task.findOneAndDelete({ _id: taskId, userId });
      if (!task) {
        throw new Error('Task not found or unauthorized');
      }

      console.log(`Successfully deleted task ${taskId}`);
      return true;
    } catch (error) {
      console.error('Error in TaskService.delete:', error);
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }
}

module.exports = TaskService;