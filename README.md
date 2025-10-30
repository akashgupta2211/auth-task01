# Task Management API

A Node.js REST API for managing tasks with role-based authentication and authorization.

## What's Inside

- JWT authentication with role-based access (Admin, Manager, User)
- CRUD operations for tasks
- Task assignment and filtering
- Input validation using Zod
- Custom error handling

## Tech Used

- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- bcryptjs for password hashing
- Zod for validation

## Getting Started

### You'll Need

- Node.js (v14+)
- MongoDB
- npm

### Installation

```bash
# Clone and navigate
git clone <your-repo-url>
cd backend

# Install packages
npm install

# Create .env file
cp .env.example .env
```

### Environment Setup

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
DEV_DB_URL=mongodb://localhost:27017/taskdb
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
```

### Run

```bash

# Production
npm start
```

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Auth

**Sign Up**
```
POST /users/signup
{
  "username": "akash",
  "email": "akash@mail.com",
  "password": "pass123",
  "role": "user"
}
```

**Sign In**
```
POST /users/signin
{
  "email": "akash@mail.com",
  "password": "pass123"
}
```

**Get Profile**
```
GET /users/profile
Headers: Authorization: Bearer <token>
```

### Tasks

**Create Task** (Admin/Manager)
```
POST /tasks
Headers: Authorization: Bearer <token>
{
  "title": "Task title",
  "description": "Task details",
  "priority": "high",
  "dueDate": "2025-12-31",
  "status":"pending"
  }
```

**Get Tasks** (All roles)
```
GET /tasks?priority=high&status=pending
Headers: Authorization: Bearer <token>
```

**Update Task** (Admin/Manager)
```
PUT /tasks/:id
Headers: Authorization: Bearer <token>
{
  "status": "in-progress"
}
```

**Delete Task** (Admin/Manager)
```
DELETE /tasks/:id
Headers: Authorization: Bearer <token>
```

**Assign Task** (Manager only)
```
POST /tasks/:id/assign
Headers: Authorization: Bearer <token>
{
  "assignedTo": "user_id"
}
```

**Get Assigned Tasks**
```
GET /tasks/assigned/:userId
Headers: Authorization: Bearer <token>
```

### Admin

**Get Users by Role** (Admin only)
```
GET /users/admin?role=user
Headers: Authorization: Bearer <token>
```

**View Users** (Admin/Manager)
```
GET /users/manager?role=user
Headers: Authorization: Bearer <token>
```

## Roles & Access

**Admin**
- Full system access
- Manage all users and tasks
- View all data

**Manager**
- Create and assign tasks
- Assign tasks to users only
- View team members

**User**
- View assigned tasks
- Update own task status
- Limited access

## Filters

Tasks can be filtered by:
- `priority`: low, medium, high
- `status`: pending, in-progress, completed
- `dueDateFrom`: Start date (ISO format)
- `dueDateTo`: End date (ISO format)

## Validation

**Users**
- Username: 3-50 chars, alphanumeric
- Email: Valid format, unique
- Password: Min 6 characters

**Tasks**
- Title: 3-100 chars, required
- Description: Max 500 chars
- Priority: low/medium/high
- Status: pending/in-progress/completed
- Due date: Cannot be past date

## Error Responses

**400 - Validation Error**
```json
{
  "success": false,
  "err": ["Field validation messages"],
  "message": "Validation failed"
}
```

**401/403 - Auth Error**
```json
{
  "success": false,
  "err": "Unauthorized access",
  "message": "Invalid token"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "err": "Resource not found",
  "message": "Task not found"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "err": {},
  "message": "Internal server Error"
}
```

## Project Structure

```
src/
├── config/          # DB and server config
├── controllers/     # Request handlers
├── middlewares/     # Auth, validation, role checks
├── models/          # Mongoose schemas
├── repositories/    # DB operations
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helpers and errors
└── validators/      # Zod schemas
```

## Security

- Passwords hashed with bcryptjs (salt: 9)
- JWT tokens for authentication
- Role-based authorization
- Input validation on all endpoints
- No sensitive data in errors

## Scripts

```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

## Notes

- Default avatar generated using robohash
- Timestamps added automatically
- Managers cannot assign tasks to admins/managers

 
