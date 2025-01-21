require('dotenv').config();
const { connectDB } = require('../config/database');
const Task = require('../models/Task');

const sampleTasks = [
  {
    name: 'Complete Project Documentation',
    description: 'Write comprehensive documentation for the current project phase',
    status: 'Pending',
  },
  {
    name: 'Review Code Changes',
    description: 'Review and provide feedback on recent pull requests',
    status: 'Pending',
  },
  {
    name: 'Update Dependencies',
    description: 'Update project dependencies to their latest stable versions',
    status: 'Completed',
  },
  {
    name: 'Fix Security Vulnerabilities',
    description: 'Address identified security issues in the codebase',
    status: 'Completed',
  },
  {
    name: 'Deploy to Production',
    description: 'Deploy the latest changes to the production environment',
    status: 'Done',
  },
  {
    name: 'User Testing',
    description: 'Conduct user testing sessions for new features',
    status: 'Done',
  }
];

async function seedTasks() {
  try {
    // Connect to database
    await connectDB();

    // Check if tasks already exist
    const existingTasks = await Task.countDocuments();

    if (existingTasks > 0) {
      console.log('Tasks already exist in the database');
      process.exit(0);
    }

    // Create tasks
    const tasks = await Task.insertMany(sampleTasks);

    console.log('Sample tasks created successfully:');
    tasks.forEach(task => {
      console.log(`- ${task.name} (${task.status})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding tasks:', error.message);
    process.exit(1);
  }
}

seedTasks();