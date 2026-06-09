package com.taskmanager.dto;

import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SubTaskRequest {
    @NotBlank(message = "Project is required")
    private String projectId;

    @NotBlank(message = "Parent task is required")
    private String parentTaskId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private TaskStatus status;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotBlank(message = "Assigned employee is required")
    private String assignedTo;

    private String assignedToName;
}
