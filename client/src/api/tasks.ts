// @ts-nocheck
import api from './api';

export type Task = {
  _id: string;
  name: string;
  description: string;
  status: 'Pending' | 'Completed' | 'Done';
  userId: string;
  createdAt: string;
};

// Description: Get all tasks for the authenticated user
// Endpoint: GET /api/tasks
// Request: {}
// Response: { tasks: Task[] }
export const getTasks = async () => {
  try {
    const response = await api.get('/api/tasks');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || error.message);
    } else {
      throw new Error(error.message);
    }
  }
};

// Description: Create a new task
// Endpoint: POST /api/tasks
// Request: { name: string, description: string }
// Response: { task: Task }
export const createTask = async (data: { name: string; description: string }) => {
  try {
    const response = await api.post('/api/tasks', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update task status
// Endpoint: PATCH /api/tasks/:id/status
// Request: { status: 'Pending' | 'Completed' | 'Done' }
// Response: { task: Task }
export const updateTaskStatus = async (id: string, status: Task['status']) => {
  console.log(`Attempting to update task ${id} to status ${status}`);
  try {
    const response = await api.put(`/api/tasks/${id}/status`, { status });
    console.log('Update task response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a task
// Endpoint: DELETE /api/tasks/:id
// Request: {}
// Response: { success: boolean }
export const deleteTask = async (id: string) => {
  try {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};