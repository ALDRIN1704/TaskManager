# Presentation Script: Task Manager Full-Stack Application

This script is designed to help you present the reconstructed Task Manager application in detail, highlighting the architecture, design choices, clean structures, and workflow.

---

## Part 1: Introduction (Slide 1: Overview)

"Good morning/afternoon everyone. Today, I am excited to present **Task Manager**, a clean, modern, and production-grade full-stack task management application. 

The primary goal of this project is to provide a streamlined, zero-bloat platform for administrators to create and delegate tasks, and for employees to view and update their individual tasks on personal Kanban boards.

We reconstructed this project from the ground up to ensure a clean codebase, modern styling, robust API validations, and seamless drag-and-drop synchronization. All complex analytics, designation displays, and legacy boilerplate have been completely removed to focus on speed, correctness, and a premium user experience."

---

## Part 2: Tech Stack & Architecture (Slide 2: System Architecture)

"Let's look at the core technical stack powering Task Manager:

1. **Frontend**: Built using **React (v18)** and **Vite** for lightning-fast compilation and hot-reloading. Styling is implemented using modern responsive CSS classes, providing smooth gradients, custom scrollbars, and premium hover effects.
2. **Backend**: Powered by **Spring Boot (v3.2)**, utilizing Java 17/21 features to expose lightweight REST endpoints.
3. **Database**: We use **MongoDB** for flexible, document-based task persistence, connecting via Spring Data MongoDB.
4. **API Communication**: Done via **Axios** with a Vite proxy configured to channel requests seamlessly between frontend port `5173` and backend port `8080` without origin issues."

---

## Part 3: Backend Code Walkthrough (Slide 3: Backend Codebase)

"Now, let's dive into the backend source directory. The package structure is highly modular, placed entirely under the `com.taskmanager` namespace:

### 1. The Model Layer
- **`Task.java`**: Maps directly to the MongoDB `tasks` collection. It contains only clean, essential fields: `id`, `title`, `description`, `status` (as enum), `priority` (as enum), `dueDate` (LocalDate), and employee details (`assignedTo`, `assignedToName`).
- **`TaskStatus.java`**: Enum defining three distinct workflow states: `TODO`, `IN_PROGRESS`, and `COMPLETED`.
- **`TaskPriority.java`**: Enum defining priority tiers: `LOW`, `MEDIUM`, and `HIGH`.
- We also integrated Spring Data's auditing annotations, `@CreatedDate` and `@LastModifiedDate`, to capture `createdAt` and `updatedAt` timestamps automatically.

### 2. Validation and DTOs
- To prevent corrupt data, we introduced JSR-380 validation annotations on **`TaskRequest.java`**:
  - The `title`, `priority`, `dueDate`, and `assignedTo` employee ID are marked as required.
  - The `@FutureOrPresent` annotation is applied to `dueDate` to ensure no task can be scheduled in the past.
- **`StatusUpdateRequest.java`**: A dedicated validation DTO for updating task states.
- **`GlobalExceptionHandler.java`**: Integrates a controller advice that intercepts validation and resource exceptions. It extracts error logs and maps them into a clean client-safe response.

### 3. Service & Repository Layers
- **`TaskRepository.java`**: Inherits `MongoRepository` and adds `findByAssignedTo(String assignedTo)` to fetch tasks specifically for an individual employee.
- **`TaskService.java`**: Contains all business operations. It isolates database queries, constructs entities from requests, manually enforces timestamp refreshes, and throws custom exceptions.

### 4. Controller Layer
- **`TaskController.java`**: Exposes a clean, REST-compliant set of endpoints:
  - `GET /api/tasks` - Fetch all tasks for Admin.
  - `GET /api/tasks/{id}` - Fetch single task details.
  - `GET /api/tasks/employee/{employeeId}` - Fetch tasks for a specific employee.
  - `POST /api/tasks` - Create task (with validations).
  - `PUT /api/tasks/{id}` - Update task details.
  - `PATCH /api/tasks/{id}/status` - Status updates (triggered by drag-and-drop).
  - `DELETE /api/tasks/{id}` - Delete task."

---

## Part 4: Frontend Code Walkthrough (Slide 4: Frontend Codebase)

"Moving to the frontend, the React structure is organized to separate concerns cleanly:

### 1. Core Config & Services
- **`App.jsx`**: Sets up React Router to handle only the three valid path patterns:
  - `/` (Home page)
  - `/admin` (Admin page)
  - `/employee/:employeeId` (Individual Employee Boards)
- **`data/employees.js`**: Stores a clean list of the 5 active employees, storing only personal fields: `id`, `name`, `email`, and `phone`. (Designations and departments have been completely removed).
- **`services/taskService.js`**: Simple, direct Axios service mapping directly to the 7 backend REST APIs.

### 2. Reusable Components
- **`Navbar.jsx`**: Title header displaying the current date. All offline and syncing badges have been removed to keep the interface premium and professional.
- **`StatsCard.jsx`**: Renders count metrics with styled iconography for the Admin dashboard.
- **`ConfirmDialog.jsx`**: Custom confirm dialog to prevent accidental task deletions.
- **`TaskForm.jsx`**: Modal form handling task creation and editing, incorporating local validations to provide immediate feedback.
- **`KanbanBoard.jsx`**: Core interaction panel built using **`@dnd-kit/core`** hooks (`useDraggable` and `useDroppable`). When a task is dragged between columns, it updates the UI immediately and triggers the PATCH API to save the new status (`TODO`, `IN_PROGRESS`, `COMPLETED`) to MongoDB.

### 3. Pages
- **`Home.jsx`**: The portal entry. Displays cards for all 5 employees and a clear link to the Admin control board.
- **`Admin.jsx`**: The command center. Displays simple cards for task summaries, a create trigger, and the team tasks list.
- **`EmployeeBoard.jsx`**: The personal workspace. Displays the employee's personal contact details and their personal Kanban board."

---

## Part 5: Demo Flow & Conclusion (Slide 5: Summary & Benefits)

"Let's trace a typical workflow sequence in the running application:
1. **Admin Creation**: The administrator logs in, clicks 'Create Task', fills out the details, and assigns it to 'Arun Kumar' with a future due date. The dashboard stats update immediately.
2. **Employee Board**: Arun Kumar opens his board via the portal. His board shows the task in the 'To Do' column. He can click 'Details' to view the description and priority.
3. **Drag-and-Drop Sync**: Arun drags the task from 'To Do' to 'In Progress'. The frontend moves the card instantly, calls `PATCH /api/tasks/{id}/status`, and commits the state. 
4. **Admin Reflection**: When the administrator views the dashboard, the status counts and the task's status cards automatically sync to show 'In Progress'.

In summary, the project has been fully reconstructed into a clean, simple, and compilation-ready full-stack application. It compiles without any warnings, communicates securely, and adheres perfectly to the clean design guidelines."
