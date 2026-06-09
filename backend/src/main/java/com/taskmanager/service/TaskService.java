package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.model.SubTask;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.SubTaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final SubTaskRepository subTaskRepository;
    private final ActivityService activityService;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       SubTaskRepository subTaskRepository,
                       ActivityService activityService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.subTaskRepository = subTaskRepository;
        this.activityService = activityService;
    }

    private void validateDates(TaskRequest request) {
        if (request.getDueDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("Due date cannot be before start date");
        }
    }

    public Task createTask(TaskRequest request) {
        validateDates(request);

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + request.getProjectId()));

        Task task = Task.builder()
                .projectId(request.getProjectId())
                .projectName(project.getName())
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .assignedTo(request.getAssignedTo())
                .assignedToName(request.getAssignedToName())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Task saved = taskRepository.save(task);

        activityService.logActivity(
                saved.getProjectId(),
                saved.getProjectName(),
                saved.getId(),
                null,
                "Task created",
                "Admin",
                "Task '" + saved.getTitle() + "' was created and assigned to " + saved.getAssignedToName() + "."
        );

        return saved;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
    }

    public List<Task> getTasksByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksByEmployeeId(String employeeId) {
        return taskRepository.findByAssignedTo(employeeId);
    }

    public Task updateTask(String id, TaskRequest request) {
        validateDates(request);

        Task task = getTaskById(id);
        String oldTitle = task.getTitle();

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + request.getProjectId()));

        task.setProjectId(request.getProjectId());
        task.setProjectName(project.getName());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setType(request.getType());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        task.setPriority(request.getPriority());
        task.setStartDate(request.getStartDate());
        task.setDueDate(request.getDueDate());
        task.setAssignedTo(request.getAssignedTo());
        task.setAssignedToName(request.getAssignedToName());
        task.setUpdatedAt(LocalDateTime.now());

        Task saved = taskRepository.save(task);

        if (!oldTitle.equals(saved.getTitle())) {
            List<SubTask> subtasks = subTaskRepository.findByParentTaskId(saved.getId());
            for (SubTask st : subtasks) {
                st.setParentTaskTitle(saved.getTitle());
                subTaskRepository.save(st);
            }
        }

        activityService.logActivity(
                saved.getProjectId(),
                saved.getProjectName(),
                saved.getId(),
                null,
                "Task updated",
                "Admin",
                "Task details for '" + saved.getTitle() + "' were updated."
        );

        return saved;
    }

    public Task updateTaskStatus(String id, TaskStatus status, String actorName) {
        Task task = getTaskById(id);
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());

        Task saved = taskRepository.save(task);

        if (oldStatus != status) {
            String actor = (actorName != null && !actorName.isBlank()) ? actorName : saved.getAssignedToName();
            if (actor == null || actor.isBlank()) actor = "Admin";
            
            activityService.logActivity(
                    saved.getProjectId(),
                    saved.getProjectName(),
                    saved.getId(),
                    null,
                    "Task moved from " + oldStatus + " to " + status,
                    actor,
                    "Task '" + saved.getTitle() + "' status changed to " + status + "."
            );
        }

        return saved;
    }

    public void deleteTask(String id) {
        Task task = getTaskById(id);
        
        List<SubTask> subtasks = subTaskRepository.findByParentTaskId(id);
        subTaskRepository.deleteAll(subtasks);

        taskRepository.delete(task);

        activityService.logActivity(
                task.getProjectId(),
                task.getProjectName(),
                id,
                null,
                "Task deleted",
                "Admin",
                "Task '" + task.getTitle() + "' and its subtasks were deleted."
        );
    }
}
