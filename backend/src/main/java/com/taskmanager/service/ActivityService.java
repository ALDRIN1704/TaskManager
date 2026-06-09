package com.taskmanager.service;

import com.taskmanager.model.Activity;
import com.taskmanager.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public Activity logActivity(String projectId, String projectName, String taskId, String subTaskId, String action, String actorName, String details) {
        Activity activity = Activity.builder()
                .projectId(projectId)
                .projectName(projectName)
                .taskId(taskId)
                .subTaskId(subTaskId)
                .action(action)
                .actorName(actorName)
                .details(details)
                .createdAt(LocalDateTime.now())
                .build();
        return activityRepository.save(activity);
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Activity> getActivitiesByProjectId(String projectId) {
        return activityRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public List<Activity> getActivitiesByTaskId(String taskId) {
        return activityRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }
}
