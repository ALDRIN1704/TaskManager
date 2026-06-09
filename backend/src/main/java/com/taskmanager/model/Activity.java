package com.taskmanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "activities")
public class Activity {
    @Id
    private String id;
    private String projectId;
    private String projectName;
    private String taskId;
    private String subTaskId;
    private String action;
    private String actorName;
    private String details;
    private LocalDateTime createdAt;
}
