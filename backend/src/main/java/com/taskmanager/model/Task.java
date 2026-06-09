package com.taskmanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String projectId;
    private String projectName;
    private String title;
    private String description;
    private TaskType type;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private String assignedTo;
    private String assignedToName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
