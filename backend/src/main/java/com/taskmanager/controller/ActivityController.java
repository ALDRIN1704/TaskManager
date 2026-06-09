package com.taskmanager.controller;

import com.taskmanager.model.Activity;
import com.taskmanager.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Activity>> getActivitiesByProjectId(@PathVariable String projectId) {
        return ResponseEntity.ok(activityService.getActivitiesByProjectId(projectId));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Activity>> getActivitiesByTaskId(@PathVariable String taskId) {
        return ResponseEntity.ok(activityService.getActivitiesByTaskId(taskId));
    }
}
