# Presentation Script: Task Manager Full-Stack Application

This script is designed to help you present the Task Manager project and task management system in detail, highlighting the architecture, design choices, clean structures, and workflow.

---

## Part 1: Introduction (Slide 1: Overview)

"Good morning/afternoon everyone. Today, I am excited to present **Task Manager**, a clean, modern, and professional full-stack project and task management system.

The primary goal of this project is to provide a streamlined, zero-bloat platform for administrators to create projects, tasks, and subtasks, and assign them to employees, while allowing employees to view and update their assigned work via individual Kanban boards.

We upgraded the application to support full multi-project management, subtask nesting, comprehensive activity logging, advanced multi-criteria filters, and real-time due date alerts with visual indicators."

---

## Part 2: Tech Stack & Architecture (Slide 2: System Architecture)

"Let's look at the core technical stack powering Task Manager:

1. **Frontend**: Built using **React (v18)**, **Vite**, and **React Router** for route management. Drag-and-drop operations on the Kanban boards are powered by **DnD Kit**.
2. **Backend**: Powered by **Spring Boot (v3.2)**, exposing RESTful Web APIs.
3. **Database**: We use **MongoDB** for flexible, document-based persistence, persisting projects, tasks, subtasks, and activities.
4. **API Communication**: Done via **Axios** with a Vite proxy configured to channel requests between port `5173` and backend port `8080` without origin issues."

---

## Part 3: Backend Code Walkthrough (Slide 3: Backend Codebase)

"Now, let's look at the backend source directory. The package structure is highly modular, placed entirely under the `com.taskmanager` namespace:

### 1. The Model Layer
- **`Project.java`**: Represents a project with a start date, end date, and description.
- **`Task.java`**: Represents a task associated with a project. Fields include project details, title, description, status, priority, type (TASK, BUG, FEATURE, STORY), start date, and due date.
- **`SubTask.java`**: Represents a subtask associated with a parent task and project. It tracks its own status, priority, dates, and assignee.
- **`Activity.java`**: Maps to the audit trail collection, logging who performed what action, when, and with what details.

### 2. Validation and DTOs
- We enforce validations on incoming requests:
  - **`ProjectRequest.java`**: Name, start date, and end date are required. The system validates that the end date cannot be before the start date.
  - **`TaskRequest.java`** and **`SubTaskRequest.java`**: Fields like project ID, title, type/priority, dates, and assigned employee are required. Due dates cannot be before start dates.
- **`GlobalExceptionHandler.java`**: Handles resource exceptions and converts date validation errors into client-safe 400 Bad Request responses.

### 3. Services & Repositories
- Repositories inherit from `MongoRepository` and define custom queries like finding tasks or subtasks by project, task, or employee.
- Services manage business rules: validating date ranges, cascading deletions (e.g. deleting a project deletes all its tasks and subtasks), and writing activity log entries.

### 4. Controller Layer
- Exposes clean REST endpoints for projects, tasks, subtasks, and activities."

---

## Part 4: Frontend Code Walkthrough (Slide 4: Frontend Codebase)

"On the React frontend, the structure is organized cleanly:

### 1. Core Config & Services
- **`App.jsx`**: Configures routes for `/`, `/admin`, `/admin/projects`, `/admin/projects/:projectId`, and `/employee/:employeeId`.
- **`data/employees.js`**: Stores the employee records (name, email, phone).
- **`services/`**: Services like `projectService.js`, `taskService.js`, `subTaskService.js`, and `activityService.js` handle all API communications.

### 2. Reusable Components & Utilities
- **`dateUtils.js`**: Calculates project/task duration in days and computes due date alert categories (Overdue, Due Today, Due Soon, On Track).
- **`filterUtils.js`**: Evaluates active filters (project, status, priority, type, assignee, alert, and search keyword) on lists of items.
- **`DueBadge.jsx`**: Renders due status alerts with color-coded badges.
- **`FilterBar.jsx`**: Multi-criteria filter select headers.
- **`ActivityTimeline.jsx`**: Timeline list rendering recent actions.
- **`KanbanBoard.jsx`**: Handles drag-and-drop actions for both tasks and subtasks using prefixed draggable IDs (`task-{id}` and `subtask-{id}`).

### 3. Pages
- **`Home.jsx`**: Main portal linking to Admin, Projects, and Employee boards.
- **`Admin.jsx`**: Dashboard showing total stats, recent tasks in a table, filters, and activity timelines.
- **`Projects.jsx`**: Projects directory for project management.
- **`ProjectDetails.jsx`**: Drill-down project view displaying nested tasks, subtasks, and project activities.
- **`EmployeeBoard.jsx`**: Kanban board showing assigned tasks and subtasks."

---

## Part 5: Demo Flow & Conclusion

"Let's trace a typical workflow sequence in the upgraded system:
1. **Project Setup**: An admin creates a project, defining its duration.
2. **Task Delegation**: The admin creates tasks and subtasks under the project, assigning them to employees.
3. **Employee Kanban Update**: The employee sees tasks and subtasks on their Kanban board, dragging cards to update their status. This triggers a PATCH API, updates MongoDB, and posts an activity log.
4. **Dashboard Synchronization**: The admin dashboard instantly reflects status updates, overdue alerts, and the activity trail.

In conclusion, the upgraded application serves as a robust, clean, and reliable project management system. It compiles and builds without warning, persist states securely in MongoDB, and delivers a premium user experience."
