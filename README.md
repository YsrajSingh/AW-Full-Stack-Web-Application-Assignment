# Affworld Assignment

Affworld Assignment is a web application designed to provide basic user authentication, a task management system, and a feed for users to post content. The project is evaluated based on functionality, design, and code quality.

## Overview

The project is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and leverages various libraries and tools to enhance functionality and user experience. The frontend is developed using ReactJS with Vite as the development server, and it employs shadcn-ui with Tailwind CSS for styling. The backend is implemented using Express.js, with MongoDB as the database, and Mongoose for object data modeling (ODM).

### Project Structure

- **Frontend (`client/`)**
  - Developed with ReactJS using Vite devserver
  - Integrated with shadcn-ui component library and Tailwind CSS framework
  - Client-side routing using `react-router-dom`
  - Pages and components are organized under `client/src/pages/` and `client/src/components/`
  - API requests are defined in `client/src/api/` and mocked for frontend implementation

- **Backend (`server/`)**
  - Built with Express.js implementing REST API endpoints
  - MongoDB database support with Mongoose
  - Token-based authentication using bearer access and refresh tokens
  - User authentication routes and services are defined in `server/routes/auth.js` and `server/services/userService.js`

## Features

1. **User Authentication**
   - Register: Users can create an account using their name, email, and password.
   - Login: Users can log in with their email and password.
   - Forgot Password: Users can reset their password via email (optional).
   - Google OAuth (Bonus): Integration for login and registration using Google OAuth (optional).

2. **Task Management System**
   - Create Task: Users can add tasks with a name and description.
   - Task Columns: UI divided into three columns (Pending, Completed, Done) with drag-and-drop functionality to move tasks between columns.
   - Delete Task: Users can delete tasks with a confirmation prompt.

3. **Feed Section**
   - Users can post content including a photo and a caption.
   - Uses Cloudinary for storing and retrieving photos.

## Getting Started

### Requirements

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB (v4.x or later)

### Quickstart

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd affworld-assignment
   ```

2. **Install dependencies:**
   ```sh
   # Install frontend dependencies
   cd client
   npm install
   cd ..

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the `server` directory with the following content:
     ```env
     PORT=3000
     MONGODB_URI=<your-mongodb-uri>
     SESSION_SECRET=<your-session-secret>
     CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
     CLOUDINARY_API_KEY=<your-cloudinary-api-key>
     CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
     ```

4. **Seed the database:**
   ```sh
   # Seed admin user
   cd server
   node scripts/seedAdmin.js
   cd ..

   # Seed tasks
   cd server
   node scripts/seedTasks.js
   cd ..
   ```

5. **Run the application:**
   ```sh
   npm run start
   ```

   This command will concurrently run both the frontend and backend servers.

6. **Access the application:**
   - Frontend: Open your browser and navigate to `http://localhost:5173`
   - Backend: The server runs on `http://localhost:3000`

### License

The project is proprietary (not open source).  
Copyright (c) 2024.
