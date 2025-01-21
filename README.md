```markdown
# Affworld Assignment

Affworld Assignment is a web application designed to provide basic user authentication, a task management system, and a feed for users to post content. The project is evaluated based on its functionality, design, and code quality.

## Overview

The project is divided into two main parts: frontend and backend.

### Architecture and Technologies Used

- **Frontend:** Built with ReactJS using the Vite development server. It utilizes `shadcn-ui` component library and Tailwind CSS for styling. Client-side routing is managed with `react-router-dom`.
- **Backend:** Implemented with Express.js, providing REST API endpoints. The backend uses MongoDB with Mongoose for database management and supports token-based authentication.
- **Database:** MongoDB.
- **Authentication:** Token-based using JWT with support for email/password and optional Google OAuth.
- **Drag-and-Drop:** Implemented using libraries like `React DnD` or `react-beautiful-dnd`.
- **Hosting:** The application is intended to be deployed on platforms like Heroku, Vercel, or Netlify.

### Project Structure

- **Frontend:** Located in the `client/` directory.
  - `client/src/pages/`: Page components.
  - `client/src/components/`: Reusable UI components.
  - `client/src/api/`: API request functions with mock data.
- **Backend:** Located in the `server/` directory.
  - `server/routes/`: API route handlers.
  - `server/models/`: Mongoose models.
  - `server/services/`: Business logic and services.
  - `server/scripts/`: Scripts for seeding the database.

## Features

1. **User Authentication (20 Marks)**
   - Register: Users can create an account using their name, email, and password.
   - Login: Users can log in with their email and password.
   - Forgot Password: Users can reset their password (email-based reset is optional).
   - Google OAuth (Bonus 5 Marks): Optional Google OAuth integration for login and registration.

2. **Task Management System (50 Marks)**
   - Create Task (10 Marks): Users can add tasks with a name and description.
   - Task Columns (30 Marks): UI divided into three columns (Pending, Completed, Done) with drag-and-drop functionality.
   - Delete Task (10 Marks): Users can delete tasks with a confirmation prompt.

3. **Feed Section (30 Marks)**
   - Users can post content with a photo and caption.
   - Photos are stored and retrieved using a third-party service like Cloudinary.

## Getting Started

### Requirements

- Node.js (version 14 or higher)
- MongoDB
- npm (Node Package Manager)

### Quickstart

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd affworld-assignment
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file in the `server/` directory with the following content:
     ```
     DATABASE_URL=<Your MongoDB Connection String>
     JWT_SECRET=<Your JWT Secret>
     REFRESH_TOKEN_SECRET=<Your Refresh Token Secret>
     ```

4. **Seed the Database:**
   ```bash
   node server/scripts/seedTasks.js
   node server/scripts/seedAdmin.js
   ```

5. **Run the Application:**
   ```bash
   npm run start
   ```

   - The frontend will be available at `http://localhost:5173`.
   - The backend will be available at `http://localhost:3000`.

### License

The project is proprietary (not open source). 

```
© 2024. All rights reserved.
```
```