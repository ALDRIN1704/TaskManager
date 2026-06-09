package com.taskmanager.repository;

import com.taskmanager.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ActivityRepository extends MongoRepository<Activity, String> {
    List<Activity> findByProjectIdOrderByCreatedAtDesc(String projectId);
    List<Activity> findByTaskIdOrderByCreatedAtDesc(String taskId);
    List<Activity> findAllByOrderByCreatedAtDesc();
}
