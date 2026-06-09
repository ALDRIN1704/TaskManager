package com.taskmanager.service;

import com.taskmanager.dto.SubTaskRequest;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.SubTask;
import com.taskmanager.model.TaskStatus;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.SubTaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubTaskService {

    private final SubTaskRepository subTaskRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ActivityService activityService;

    public SubTaskService(SubTaskRepository subTaskRepository,
                          TaskRepository taskRepository,
                          ProjectRepository projectRepository,
                          ActivityService activityService) {
        this.subTaskRepository = subTaskRepository;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.activityService = activityService;
    }

    private void validateDates(SubTaskRequest request) {
        if (request.getDueDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("Due date cannot be before start date");
        }
    }

    public SubTask createSubTask(SubTaskRequest request) {
        validateDates(request);

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + request.getProjectId()));

        Task parentTask = taskRepository.findById(request.getParentTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent task not found with ID: " + request.getParentTaskId()));

        SubTask subTask = SubTask.builder()
                .projectId(request.getProjectId())
                .projectName(project.getName())
                .parentTaskId(request.getParentTaskId())
                .parentTaskTitle(parentTask.getTitle())
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .assignedTo(request.getAssignedTo())
                .assignedToName(request.getAssignedToName())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        SubTask saved = subTaskRepository.save(subTask);

        activityService.logActivity(
                saved.getProjectId(),
                saved.getProjectName(),
                saved.getParentTaskId(),
                saved.getId(),
                "Subtask created",
                "Admin",
                "Subtask '" + saved.getTitle() + "' was created under parent task '" + saved.getParentTaskTitle() + "'."
        );

        return saved;
    }

    public List<SubTask> getAllSubTasks() {
        return subTaskRepository.findAll();
    }

    public SubTask getSubTaskById(String id) {
        return subTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subtask not found with ID: " + id));
    }

    public List<SubTask> getSubTasksByProjectId(String projectId) {
        return subTaskRepository.findByProjectId(projectId);
    }

    public List<SubTask> getSubTasksByTaskId(String taskId) {
        return subTaskRepository.findByParentTaskId(taskId);
    }

    public List<SubTask> getSubTasksByEmployeeId(String employeeId) {
        return subTaskRepository.findByAssignedTo(employeeId);
    }

    public SubTask updateSubTask(String id, SubTaskRequest request) {
        validateDates(request);

        SubTask subTask = getSubTaskById(id);

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + request.getProjectId()));

        Task parentTask = taskRepository.findById(request.getParentTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent task not found with ID: " + request.getParentTaskId()));

        subTask.setProjectId(request.getProjectId());
        subTask.setProjectName(project.getName());
        subTask.setParentTaskId(request.getParentTaskId());
        subTask.setParentTaskTitle(parentTask.getTitle());
        subTask.setTitle(request.getTitle());
        subTask.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            subTask.setStatus(request.getStatus());
        }
        subTask.setPriority(request.getPriority());
        subTask.setStartDate(request.getStartDate());
        subTask.setDueDate(request.getDueDate());
        subTask.setAssignedTo(request.getAssignedTo());
        subTask.setAssignedToName(request.getAssignedToName());
        subTask.setUpdatedAt(LocalDateTime.now());

        SubTask saved = subTaskRepository.save(subTask);

        activityService.logActivity(
                saved.getProjectId(),
                saved.getProjectName(),
                saved.getParentTaskId(),
                saved.getId(),
                "Subtask updated",
                "Admin",
                "Subtask details for '" + saved.getTitle() + "' were updated."
        );

        return saved;
    }

    public SubTask updateSubTaskStatus(String id, TaskStatus status, String actorName) {
        SubTask subTask = getSubTaskById(id);
        TaskStatus oldStatus = subTask.getStatus();
        subTask.setStatus(status);
        subTask.setUpdatedAt(LocalDateTime.now());

        SubTask saved = subTaskRepository.save(subTask);

        if (oldStatus != status) {
            String actor = (actorName != null && !actorName.isBlank()) ? actorName : saved.getAssignedToName();
            if (actor == null || actor.isBlank()) actor = "Admin";

            activityService.logActivity(
                    saved.getProjectId(),
                    saved.getProjectName(),
                    saved.getParentTaskId(),
                    saved.getId(),
                    "Subtask moved from " + oldStatus + " to " + status,
                    actor,
                    "Subtask '" + saved.getTitle() + "' status changed to " + status + "."
            );
        }

        return saved;
    }

    public void deleteSubTask(String id) {
        SubTask subTask = getSubTaskById(id);
        subTaskRepository.delete(subTask);

        activityService.logActivity(
                subTask.getProjectId(),
                subTask.getProjectName(),
                subTask.getParentTaskId(),
                id,
                "Subtask deleted",
                "Admin",
                "Subtask '" + subTask.getTitle() + "' was deleted."
        );
    }
}
