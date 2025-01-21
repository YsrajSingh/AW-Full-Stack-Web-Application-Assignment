import api from './api';

export type Task = {
  _id: string;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'done';
  createdAt: string;
};

// Description: Get all tasks
// Endpoint: GET /api/tasks
// Request: {}
// Response: { tasks: Task[] }
export const getTasks = () => {
  return new Promise<{ tasks: Task[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        tasks: [
          {
            _id: '1',
            name: 'Create landing page',
            description: 'Design and implement the landing page',
            status: 'pending',
            createdAt: '2024-03-20T10:00:00.000Z',
          },
          {
            _id: '2',
            name: 'Implement authentication',
            description: 'Add login and registration functionality',
            status: 'completed',
            createdAt: '2024-03-19T15:30:00.000Z',
          },
          {
            _id: '3',
            name: 'Set up database',
            description: 'Configure MongoDB and create schemas',
            status: 'done',
            createdAt: '2024-03-18T09:15:00.000Z',
          },
        ],
      });
    }, 500);
  });
};

// Description: Create a new task
// Endpoint: POST /api/tasks
// Request: { name: string, description: string }
// Response: { task: Task }
export const createTask = (data: { name: string; description: string }) => {
  return new Promise<{ task: Task }>((resolve) => {
    setTimeout(() => {
      resolve({
        task: {
          _id: Math.random().toString(36).substr(2, 9),
          ...data,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      });
    }, 500);
  });
};

// Description: Update task status
// Endpoint: PATCH /api/tasks/:id
// Request: { status: 'pending' | 'completed' | 'done' }
// Response: { task: Task }
export const updateTaskStatus = (id: string, status: Task['status']) => {
  return new Promise<{ task: Task }>((resolve) => {
    setTimeout(() => {
      resolve({
        task: {
          _id: id,
          name: 'Sample Task',
          description: 'Sample Description',
          status,
          createdAt: new Date().toISOString(),
        },
      });
    }, 500);
  });
};

// Description: Delete a task
// Endpoint: DELETE /api/tasks/:id
// Request: {}
// Response: { success: boolean }
export const deleteTask = (id: string) => {
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};