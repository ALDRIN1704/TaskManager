package com.taskmanager.service;

import com.taskmanager.dto.ProjectRequest;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.SubTask;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.SubTaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final SubTaskRepository subTaskRepository;
    private final ActivityService activityService;

    public ProjectService(ProjectRepository projectRepository, 
                          TaskRepository taskRepository, 
                          SubTaskRepository subTaskRepository,
                          ActivityService activityService) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.subTaskRepository = subTaskRepository;
        this.activityService = activityService;
    }

    private void validateDates(ProjectRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
    }

    public Project createProject(ProjectRequest request) {
        validateDates(request);

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Project saved = projectRepository.save(project);
        
        activityService.logActivity(
                saved.getId(),
                saved.getName(),
                null,
                null,
                "Project created",
                "Admin",
                "Project '" + saved.getName() + "' was successfully created."
        );

        return saved;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
    }

    public Project updateProject(String id, ProjectRequest request) {
        validateDates(request);
        
        Project project = getProjectById(id);
        String oldName = project.getName();
        
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setUpdatedAt(LocalDateTime.now());
        
        Project saved = projectRepository.save(project);

        if (!oldName.equals(saved.getName())) {
            List<Task> tasks = taskRepository.findByProjectId(saved.getId());
            for (Task task : tasks) {
                task.setProjectName(saved.getName());
                taskRepository.save(task);
            }

            List<SubTask> subtasks = subTaskRepository.findByProjectId(saved.getId());
            for (SubTask subTask : subtasks) {
                subTask.setProjectName(saved.getName());
                subTaskRepository.save(subTask);
            }
        }

        activityService.logActivity(
                saved.getId(),
                saved.getName(),
                null,
                null,
                "Project updated",
                "Admin",
                "Project details for '" + saved.getName() + "' were updated."
        );

        return saved;
    }

    public void deleteProject(String id) {
        Project project = getProjectById(id);
        
        List<Task> tasks = taskRepository.findByProjectId(id);
        for (Task t : tasks) {
            List<SubTask> subTasks = subTaskRepository.findByParentTaskId(t.getId());
            subTaskRepository.deleteAll(subTasks);
            taskRepository.delete(t);
        }
        
        projectRepository.delete(project);

        activityService.logActivity(
                id,
                project.getName(),
                null,
                null,
                "Project deleted",
                "Admin",
                "Project '" + project.getName() + "' and its associated tasks/subtasks were deleted."
        );
    }
}
