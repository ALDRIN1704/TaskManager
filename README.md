# Task Manager

## Overview
Task Manager is a simple full-stack task management application for assigning and tracking employee tasks.

## Features
- Admin dashboard
- Employee boards
- Create, edit, delete tasks
- Assign tasks to employees
- Kanban board
- Drag and drop status update
- MongoDB persistence

## Tech Stack
Frontend:
- React
- Vite
- Axios

Backend:
- Spring Boot
- MongoDB

## Run Backend
```bash
cd backend
mvn spring-boot:run
```

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
- `GET    /api/tasks` - Fetch all tasks
- `GET    /api/tasks/{id}` - Fetch task details by ID
- `GET    /api/tasks/employee/{employeeId}` - Fetch tasks assigned to a specific employee
- `POST   /api/tasks` - Create a new task
- `PUT    /api/tasks/{id}` - Update details of an existing task
- `PATCH  /api/tasks/{id}/status` - Update the status of a task (TODO, IN_PROGRESS, COMPLETED)
- `DELETE /api/tasks/{id}` - Delete a task by ID
