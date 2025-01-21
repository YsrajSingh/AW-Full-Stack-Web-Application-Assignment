const Task = require('../models/Task');

class TaskService {
  static async create(taskData) {
    try {
      console.log(`Creating new task with name: ${taskData.name}`);

      const task = new Task({
        name: taskData.name,
        description: taskData.description,
        status: 'Pending' // Default status for new tasks
      });

      await task.save();

      console.log(`Successfully created task with ID: ${task._id}`);
      return task;
    } catch (error) {
      console.error('Error in TaskService.create:', error);
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  static async list() {
    try {
      console.log('Fetching all tasks');
      const tasks = await Task.find({}).sort({ createdAt: -1 });
      console.log(`Successfully fetched ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      console.error('Error in TaskService.list:', error);
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  }

  static async updateStatus(taskId, status) {
    try {
      console.log(`Updating task ${taskId} status to: ${status}`);

      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
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

  static async delete(taskId) {
    try {
      console.log(`Deleting task with ID: ${taskId}`);

      const task = await Task.findByIdAndDelete(taskId);
      if (!task) {
        throw new Error('Task not found');
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