# Affworld Assignment

Affworld Assignment is a web application designed to provide user authentication, task management, and content feed functionalities. The project is evaluated based on its functionality, design, and code quality.

## Overview

The Affworld Assignment is structured into two main parts: the frontend and the backend. The frontend is built using ReactJS with Vite as the development server, and it utilizes the shadcn-ui component library with Tailwind CSS for styling. The backend is implemented using Express.js and MongoDB for the database. The project follows a REST API architecture for communication between the frontend and backend.

### Architecture and Technologies Used
- **Frontend**:
  - ReactJS
  - Vite
  - shadcn-ui component library
  - Tailwind CSS
  - react-router-dom for client-side routing
  - React DnD or react-beautiful-dnd for drag-and-drop functionality

- **Backend**:
  - Express.js
  - MongoDB with Mongoose for database management
  - JWT for token-based authentication
  - Cloudinary for image storage

### Project Structure
- **Frontend** (`client/` folder):
  - `components/`: Contains reusable UI components.
  - `pages/`: Contains page components for routing.
  - `api/`: Contains API request functions.
  - `contexts/`: Contains context providers for state management.
  - `hooks/`: Contains custom hooks.
  - `App.tsx`: Main React component.
  - `index.html`: Main HTML entry point.
  - `vite.config.ts`: Vite configuration.

- **Backend** (`server/` folder):
  - `models/`: Contains Mongoose schemas.
  - `routes/`: Contains route handlers.
  - `services/`: Contains business logic.
  - `utils/`: Contains utility functions.
  - `scripts/`: Contains database seeding scripts.
  - `server.js`: Main server file.
  - `.env`: Environment variables.

## Features

### User Authentication (20 Marks)
- **Register**: Users can create an account using their name, email, and password.
- **Login**: Users can log in with their email and password.
- **Forgot Password**: Users can reset their password via email.
- **Google OAuth (Bonus 5 Marks)**: Optional Google OAuth integration for login and registration.

### Task Management System (50 Marks)
- **Create Task (10 Marks)**: Users can add tasks with a name and description.
- **Task Columns (30 Marks)**: Tasks are displayed in three columns (Pending, In Progress, Done) with drag-and-drop functionality.
- **Delete Task (10 Marks)**: Users can delete tasks with confirmation.

### Feed Section (30 Marks)
- **Post Content**: Users can post content with a photo and caption.
- **Public Feed**: All posts are public, but the author's name is displayed as "Unknown User" if not provided.
- **Delete Post**: Only the user who created a post can delete it.
- **Filter Posts**: Users can filter between public posts and their own posts.

## Getting Started

### Requirements
- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB (>= 4.4)

### Quickstart

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd affworld-assignment
   ```

2. **Install dependencies**:
   ```sh
   npm install
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `server/` directory with the following content:
   ```env
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. **Seed the database**:
   ```sh
   node server/scripts/seedAdmin.js
   node server/scripts/seedTasks.js
   ```

5. **Run the application**:
   ```sh
   npm run start
   ```

   The frontend will be running on `http://localhost:5173` and the backend on `http://localhost:3000`.

### License

The project is proprietary (not open source). 

```
© 2024. All rights reserved.
```