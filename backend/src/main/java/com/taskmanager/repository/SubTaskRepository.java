package com.taskmanager.repository;

import com.taskmanager.model.SubTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SubTaskRepository extends MongoRepository<SubTask, String> {
    List<SubTask> findByProjectId(String projectId);
    List<SubTask> findByParentTaskId(String parentTaskId);
    List<SubTask> findByAssignedTo(String employeeId);
}
