# Full-Stack Task Management App

A scalable, secure full-stack web application with role-based access control and CRUD operations.

## Features
- **Backend**: Node.js, Express, Sequelize, SQLite (zero setup)
- **Frontend**: React, Vite, React Router, Axios
- **Security**: JWT-based authentication, password hashing (bcrypt)
- **Roles**: User and Admin (RBAC)
- **API Documentation**: Swagger UI included

## Prerequisites
- Node.js (v16+)

## Quick Start

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000`*
   *Swagger Docs: `http://localhost:5000/api-docs`*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Roles & Permissions
- **User**: Can view, edit, and delete only their own tasks.
- **Admin**: Can view, edit, and delete all tasks from any user.

## Architecture & Scalability
- **Modular Structure**: Controllers, models, and routes are separated to allow easy scaling of logic.
- **Relational Database**: Uses SQLite via Sequelize ORM. Can easily be switched to PostgreSQL or MySQL by modifying `db.js`.
- **Centralized Error Handling**: Express middleware ensures uniform error responses.

## API Endpoints
See Swagger documentation (`http://localhost:5000/api-docs`) after starting the server, or review `backend/swagger.yaml`.
