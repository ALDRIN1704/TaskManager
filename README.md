# Task Manager

## Overview
Task Manager is a full-stack project and task management application for assigning work, tracking task status, and managing employee task boards.

## Features
- Project management
- Task management
- Subtask management
- Task types
- Employee task boards
- Kanban status updates
- Activity history
- Filters
- Due date alerts
- MongoDB persistence

## Tech Stack
Frontend:
- React
- Vite
- Axios
- React Router
- DnD Kit

Backend:
- Spring Boot
- MongoDB

## Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

Windows:
```powershell
mvnw.cmd spring-boot:run
```

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Folder Structure
```txt
backend/src/main/java/com/taskmanager/
  TaskManagerApplication.java
  config/
    CorsConfig.java
  controller/
    ProjectController.java
    TaskController.java
    SubTaskController.java
    ActivityController.java
  dto/
    ProjectRequest.java
    TaskRequest.java
    SubTaskRequest.java
    StatusUpdateRequest.java
  exception/
    GlobalExceptionHandler.java
    ResourceNotFoundException.java
  model/
    Project.java
    Task.java
    SubTask.java
    Activity.java
    TaskPriority.java
    TaskStatus.java
    TaskType.java
  repository/
    ProjectRepository.java
    TaskRepository.java
    SubTaskRepository.java
    ActivityRepository.java
  service/
    ProjectService.java
    TaskService.java
    SubTaskService.java
    ActivityService.java

frontend/src/
  App.jsx
  main.jsx
  index.css
  data/
    employees.js
  services/
    projectService.js
    taskService.js
    subTaskService.js
    activityService.js
  utils/
    dateUtils.js
    filterUtils.js
  components/
    Navbar.jsx
    StatsCard.jsx
    ProjectCard.jsx
    ProjectForm.jsx
    TaskCard.jsx
    TaskForm.jsx
    SubTaskForm.jsx
    KanbanBoard.jsx
    FilterBar.jsx
    ActivityTimeline.jsx
    ConfirmDialog.jsx
    DueBadge.jsx
  pages/
    Home.jsx
    Admin.jsx
    Projects.jsx
    ProjectDetails.jsx
    EmployeeBoard.jsx
```

---

## API Endpoints

### Project APIs
- `GET    /api/projects` - List all projects
- `GET    /api/projects/{id}` - Get project details by ID
- `POST   /api/projects` - Create a new project
- `PUT    /api/projects/{id}` - Update project details by ID
- `DELETE /api/projects/{id}` - Delete a project (and cascading tasks/subtasks)

### Task APIs
- `GET    /api/tasks` - List all tasks
- `GET    /api/tasks/{id}` - Get task details by ID
- `GET    /api/tasks/project/{projectId}` - List tasks under a specific project
- `GET    /api/tasks/employee/{employeeId}` - List tasks assigned to a specific employee
- `POST   /api/tasks` - Create a new task
- `PUT    /api/tasks/{id}` - Update task details by ID
- `PATCH  /api/tasks/{id}/status` - Update task status
- `DELETE /api/tasks/{id}` - Delete a task (and cascading subtasks)

### SubTask APIs
- `GET    /api/subtasks` - List all subtasks
- `GET    /api/subtasks/{id}` - Get subtask details by ID
- `GET    /api/subtasks/project/{projectId}` - List subtasks under a specific project
- `GET    /api/subtasks/task/{taskId}` - List subtasks under a specific task
- `GET    /api/subtasks/employee/{employeeId}` - List subtasks assigned to a specific employee
- `POST   /api/subtasks` - Create a new subtask
- `PUT    /api/subtasks/{id}` - Update subtask details by ID
- `PATCH  /api/subtasks/{id}/status` - Update subtask status
- `DELETE /api/subtasks/{id}` - Delete a subtask

### Activity APIs
- `GET    /api/activities` - List all activities
- `GET    /api/activities/project/{projectId}` - List activities under a specific project
- `GET    /api/activities/task/{taskId}` - List activities under a specific task
