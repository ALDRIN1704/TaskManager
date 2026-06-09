package com.taskmanager.dto;

import com.taskmanager.model.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull(message = "Status is required")
    private TaskStatus status;
    
    private String actorName;
}
