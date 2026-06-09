package com.taskmanager.controller;

import com.taskmanager.dto.StatusUpdateRequest;
import com.taskmanager.dto.SubTaskRequest;
import com.taskmanager.model.SubTask;
import com.taskmanager.service.SubTaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtasks")
public class SubTaskController {

    private final SubTaskService subTaskService;

    public SubTaskController(SubTaskService subTaskService) {
        this.subTaskService = subTaskService;
    }

    @PostMapping
    public ResponseEntity<SubTask> createSubTask(@Valid @RequestBody SubTaskRequest request) {
        SubTask created = subTaskService.createSubTask(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SubTask>> getAllSubTasks() {
        return ResponseEntity.ok(subTaskService.getAllSubTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubTask> getSubTaskById(@PathVariable String id) {
        return ResponseEntity.ok(subTaskService.getSubTaskById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<SubTask>> getSubTasksByProjectId(@PathVariable String projectId) {
        return ResponseEntity.ok(subTaskService.getSubTasksByProjectId(projectId));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<SubTask>> getSubTasksByTaskId(@PathVariable String taskId) {
        return ResponseEntity.ok(subTaskService.getSubTasksByTaskId(taskId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<SubTask>> getSubTasksByEmployeeId(@PathVariable String employeeId) {
        return ResponseEntity.ok(subTaskService.getSubTasksByEmployeeId(employeeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubTask> updateSubTask(@PathVariable String id, @Valid @RequestBody SubTaskRequest request) {
        SubTask updated = subTaskService.updateSubTask(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SubTask> updateSubTaskStatus(@PathVariable String id, @Valid @RequestBody StatusUpdateRequest request) {
        SubTask updated = subTaskService.updateSubTaskStatus(id, request.getStatus(), request.getActorName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubTask(@PathVariable String id) {
        subTaskService.deleteSubTask(id);
        return ResponseEntity.noContent().build();
    }
}
