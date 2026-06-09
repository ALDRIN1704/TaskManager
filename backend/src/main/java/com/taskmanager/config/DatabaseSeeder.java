package com.taskmanager.config;

import com.taskmanager.model.*;
import com.taskmanager.repository.*;
import com.taskmanager.service.ActivityService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final SubTaskRepository subTaskRepository;
    private final ActivityRepository activityRepository;
    private final ActivityService activityService;

    public DatabaseSeeder(ProjectRepository projectRepository,
                          TaskRepository taskRepository,
                          SubTaskRepository subTaskRepository,
                          ActivityRepository activityRepository,
                          ActivityService activityService) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.subTaskRepository = subTaskRepository;
        this.activityRepository = activityRepository;
        this.activityService = activityService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Drop existing data to ensure a fresh clean state
        projectRepository.deleteAll();
        taskRepository.deleteAll();
        subTaskRepository.deleteAll();
        activityRepository.deleteAll();

        LocalDate today = LocalDate.now();

        // ==========================================
        // 1. Website Redesign Project
        // ==========================================
        Project p1 = Project.builder()
                .name("Website Redesign")
                .description("Redesign the corporate site to improve mobile responsiveness and loading speed.")
                .startDate(today)
                .endDate(today.plusDays(10))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        p1 = projectRepository.save(p1);
        activityService.logActivity(p1.getId(), p1.getName(), null, null, "Project created", "Admin", "Project 'Website Redesign' initialized.");

        // Task 1.1 (Arun)
        Task t1_1 = Task.builder()
                .projectId(p1.getId())
                .projectName(p1.getName())
                .title("Design homepage mockup")
                .description("Create high-fidelity designs for desktop and mobile layouts.")
                .type(TaskType.FEATURE)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(3))
                .assignedTo("EMP001")
                .assignedToName("Arun")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        t1_1 = taskRepository.save(t1_1);
        activityService.logActivity(p1.getId(), p1.getName(), t1_1.getId(), null, "Task created", "Admin", "Task 'Design homepage mockup' created.");

        // Subtask for Task 1.1
        SubTask st1 = SubTask.builder()
                .projectId(p1.getId())
                .projectName(p1.getName())
                .parentTaskId(t1_1.getId())
                .parentTaskTitle(t1_1.getTitle())
                .title("Revise brand assets")
                .description("Export latest high-res SVG vectors for typography.")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(2))
                .assignedTo("EMP001")
                .assignedToName("Arun")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        subTaskRepository.save(st1);
        activityService.logActivity(p1.getId(), p1.getName(), t1_1.getId(), st1.getId(), "Subtask created", "Admin", "Subtask 'Revise brand assets' created.");

        // Task 1.2 (Aswin)
        Task t1_2 = Task.builder()
                .projectId(p1.getId())
                .projectName(p1.getName())
                .title("Develop navigation bar")
                .description("Build responsive navigation header with dropdown menu components.")
                .type(TaskType.FEATURE)
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(4))
                .assignedTo("EMP002")
                .assignedToName("Aswin")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t1_2);
        activityService.logActivity(p1.getId(), p1.getName(), t1_2.getId(), null, "Task created", "Admin", "Task 'Develop navigation bar' created.");

        // Task 1.3 (Infant)
        Task t1_3 = Task.builder()
                .projectId(p1.getId())
                .projectName(p1.getName())
                .title("Optimize image assets")
                .description("Compress and convert landing page assets to WebP format for fast loads.")
                .type(TaskType.TASK)
                .status(TaskStatus.COMPLETED)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(2))
                .assignedTo("EMP003")
                .assignedToName("Infant")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t1_3);
        activityService.logActivity(p1.getId(), p1.getName(), t1_3.getId(), null, "Task created", "Admin", "Task 'Optimize image assets' created.");

        // Task 1.4 (Kavi)
        Task t1_4 = Task.builder()
                .projectId(p1.getId())
                .projectName(p1.getName())
                .title("Fix mobile rendering issues")
                .description("Fix vertical layout overlap bug on iPhone screen dimensions.")
                .type(TaskType.BUG)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(2))
                .assignedTo("EMP004")
                .assignedToName("Kavi")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t1_4);
        activityService.logActivity(p1.getId(), p1.getName(), t1_4.getId(), null, "Task created", "Admin", "Task 'Fix mobile rendering issues' created.");

        // Task 1.5 (John)
        Task t1_5 = Task.builder()
                .projectId(p1.getId())
                .projectName(p1.getName())
                .title("Write typography standards")
                .description("Document CSS clamp details and layout guidelines.")
                .type(TaskType.STORY)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(5))
                .assignedTo("EMP005")
                .assignedToName("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t1_5);
        activityService.logActivity(p1.getId(), p1.getName(), t1_5.getId(), null, "Task created", "Admin", "Task 'Write typography standards' created.");


        // ==========================================
        // 2. Mobile App Development Project
        // ==========================================
        Project p2 = Project.builder()
                .name("Mobile App Development")
                .description("Build a native mobile client for task delegation.")
                .startDate(today)
                .endDate(today.plusDays(30))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        p2 = projectRepository.save(p2);
        activityService.logActivity(p2.getId(), p2.getName(), null, null, "Project created", "Admin", "Project 'Mobile App Development' initialized.");

        // Task 2.1 (Aswin)
        Task t2_1 = Task.builder()
                .projectId(p2.getId())
                .projectName(p2.getName())
                .title("Setup REST API endpoints")
                .description("Build base controller endpoints for user state retrieval.")
                .type(TaskType.FEATURE)
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(7))
                .assignedTo("EMP002")
                .assignedToName("Aswin")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t2_1);
        activityService.logActivity(p2.getId(), p2.getName(), t2_1.getId(), null, "Task created", "Admin", "Task 'Setup REST API endpoints' created.");

        // Task 2.2 (Arun)
        Task t2_2 = Task.builder()
                .projectId(p2.getId())
                .projectName(p2.getName())
                .title("Implement login view")
                .description("Build mobile UI for user authentication with OAuth2 providers.")
                .type(TaskType.FEATURE)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(5))
                .assignedTo("EMP001")
                .assignedToName("Arun")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t2_2);
        activityService.logActivity(p2.getId(), p2.getName(), t2_2.getId(), null, "Task created", "Admin", "Task 'Implement login view' created.");

        // Task 2.3 (Infant)
        Task t2_3 = Task.builder()
                .projectId(p2.getId())
                .projectName(p2.getName())
                .title("Integrate push notifications")
                .description("Setup APNS and FCM SDK integrations for real-time alerts.")
                .type(TaskType.FEATURE)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(10))
                .assignedTo("EMP003")
                .assignedToName("Infant")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t2_3);
        activityService.logActivity(p2.getId(), p2.getName(), t2_3.getId(), null, "Task created", "Admin", "Task 'Integrate push notifications' created.");

        // Task 2.4 (Kavi)
        Task t2_4 = Task.builder()
                .projectId(p2.getId())
                .projectName(p2.getName())
                .title("Fix splash screen memory leak")
                .description("Resolve application crash on tablet configurations during start.")
                .type(TaskType.BUG)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(2))
                .assignedTo("EMP004")
                .assignedToName("Kavi")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t2_4);
        activityService.logActivity(p2.getId(), p2.getName(), t2_4.getId(), null, "Task created", "Admin", "Task 'Fix splash screen memory leak' created.");

        // Task 2.5 (John)
        Task t2_5 = Task.builder()
                .projectId(p2.getId())
                .projectName(p2.getName())
                .title("Write offline sync documentation")
                .description("Document local database synchronization sequence and conflict handling.")
                .type(TaskType.STORY)
                .status(TaskStatus.COMPLETED)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(4))
                .assignedTo("EMP005")
                .assignedToName("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t2_5);
        activityService.logActivity(p2.getId(), p2.getName(), t2_5.getId(), null, "Task created", "Admin", "Task 'Write offline sync documentation' created.");


        // ==========================================
        // 3. Cloud Infrastructure Migration Project
        // ==========================================
        Project p3 = Project.builder()
                .name("Cloud Infrastructure Migration")
                .description("Migrate on-prem servers to containerized cloud clusters.")
                .startDate(today)
                .endDate(today.plusDays(15))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        p3 = projectRepository.save(p3);
        activityService.logActivity(p3.getId(), p3.getName(), null, null, "Project created", "Admin", "Project 'Cloud Infrastructure Migration' initialized.");

        // Task 3.1 (Infant)
        Task t3_1 = Task.builder()
                .projectId(p3.getId())
                .projectName(p3.getName())
                .title("Configure AWS VPC")
                .description("Configure VPC subnets, route tables, and gateways.")
                .type(TaskType.TASK)
                .status(TaskStatus.COMPLETED)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(5))
                .assignedTo("EMP003")
                .assignedToName("Infant")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t3_1);
        activityService.logActivity(p3.getId(), p3.getName(), t3_1.getId(), null, "Task created", "Admin", "Task 'Configure AWS VPC' created.");

        // Task 3.2 (Aswin)
        Task t3_2 = Task.builder()
                .projectId(p3.getId())
                .projectName(p3.getName())
                .title("Provision EKS cluster")
                .description("Define Kubernetes cluster nodes using Terraform scripts.")
                .type(TaskType.TASK)
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(6))
                .assignedTo("EMP002")
                .assignedToName("Aswin")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t3_2);
        activityService.logActivity(p3.getId(), p3.getName(), t3_2.getId(), null, "Task created", "Admin", "Task 'Provision EKS cluster' created.");

        // Task 3.3 (Arun)
        Task t3_3 = Task.builder()
                .projectId(p3.getId())
                .projectName(p3.getName())
                .title("Setup RDS Postgres instance")
                .description("Provision high-availability Postgres RDS instance with Multi-AZ configuration.")
                .type(TaskType.TASK)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(4))
                .assignedTo("EMP001")
                .assignedToName("Arun")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t3_3);
        activityService.logActivity(p3.getId(), p3.getName(), t3_3.getId(), null, "Task created", "Admin", "Task 'Setup RDS Postgres instance' created.");

        // Task 3.4 (Kavi)
        Task t3_4 = Task.builder()
                .projectId(p3.getId())
                .projectName(p3.getName())
                .title("Resolve ingress routing bug")
                .description("Fix 502 bad gateway error on secure traffic configuration.")
                .type(TaskType.BUG)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(3))
                .assignedTo("EMP004")
                .assignedToName("Kavi")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t3_4);
        activityService.logActivity(p3.getId(), p3.getName(), t3_4.getId(), null, "Task created", "Admin", "Task 'Resolve ingress routing bug' created.");

        // Task 3.5 (John)
        Task t3_5 = Task.builder()
                .projectId(p3.getId())
                .projectName(p3.getName())
                .title("Document cluster secrets strategy")
                .description("Document how secrets are injected using HashiCorp Vault.")
                .type(TaskType.STORY)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(5))
                .assignedTo("EMP005")
                .assignedToName("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t3_5);
        activityService.logActivity(p3.getId(), p3.getName(), t3_5.getId(), null, "Task created", "Admin", "Task 'Document cluster secrets strategy' created.");


        // ==========================================
        // 4. Bug Bash Project
        // ==========================================
        Project p4 = Project.builder()
                .name("Bug Bash 2026")
                .description("Resolve all critical and blocker tickets in the backlog.")
                .startDate(today)
                .endDate(today.plusDays(7))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        p4 = projectRepository.save(p4);
        activityService.logActivity(p4.getId(), p4.getName(), null, null, "Project created", "Admin", "Project 'Bug Bash 2026' initialized.");

        // Task 4.1 (Kavi)
        Task t4_1 = Task.builder()
                .projectId(p4.getId())
                .projectName(p4.getName())
                .title("Fix session timeout crash")
                .description("Investigate and fix memory leak on JWT authentication interceptor.")
                .type(TaskType.BUG)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(2))
                .assignedTo("EMP004")
                .assignedToName("Kavi")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t4_1);
        activityService.logActivity(p4.getId(), p4.getName(), t4_1.getId(), null, "Task created", "Admin", "Task 'Fix session timeout crash' created.");

        // Task 4.2 (Aswin)
        Task t4_2 = Task.builder()
                .projectId(p4.getId())
                .projectName(p4.getName())
                .title("Resolve race condition")
                .description("Fix parallel drag-and-drop state overwriting in concurrent board shifts.")
                .type(TaskType.BUG)
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .startDate(today)
                .dueDate(today.plusDays(3))
                .assignedTo("EMP002")
                .assignedToName("Aswin")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t4_2);
        activityService.logActivity(p4.getId(), p4.getName(), t4_2.getId(), null, "Task created", "Admin", "Task 'Resolve race condition' created.");

        // Task 4.3 (Arun)
        Task t4_3 = Task.builder()
                .projectId(p4.getId())
                .projectName(p4.getName())
                .title("Fix profile upload failure")
                .description("Adjust multipart size limits to support 5MB profile JPEG images.")
                .type(TaskType.BUG)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(4))
                .assignedTo("EMP001")
                .assignedToName("Arun")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t4_3);
        activityService.logActivity(p4.getId(), p4.getName(), t4_3.getId(), null, "Task created", "Admin", "Task 'Fix profile upload failure' created.");

        // Task 4.4 (Infant)
        Task t4_4 = Task.builder()
                .projectId(p4.getId())
                .projectName(p4.getName())
                .title("Resolve timezone discrepancy")
                .description("Fix UTC rendering bug on task date details view.")
                .type(TaskType.BUG)
                .status(TaskStatus.COMPLETED)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(1))
                .assignedTo("EMP003")
                .assignedToName("Infant")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t4_4);
        activityService.logActivity(p4.getId(), p4.getName(), t4_4.getId(), null, "Task created", "Admin", "Task 'Resolve timezone discrepancy' created.");

        // Task 4.5 (John)
        Task t4_5 = Task.builder()
                .projectId(p4.getId())
                .projectName(p4.getName())
                .title("Review deprecated warnings")
                .description("Clean up legacy properties files and replace expired imports.")
                .type(TaskType.TASK)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(5))
                .assignedTo("EMP005")
                .assignedToName("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t4_5);
        activityService.logActivity(p4.getId(), p4.getName(), t4_5.getId(), null, "Task created", "Admin", "Task 'Review deprecated warnings' created.");


        // ==========================================
        // 5. Technical Documentation Project
        // ==========================================
        Project p5 = Project.builder()
                .name("Technical Documentation")
                .description("Consolidate architecture drawings and API guides.")
                .startDate(today)
                .endDate(today.plusDays(12))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        p5 = projectRepository.save(p5);
        activityService.logActivity(p5.getId(), p5.getName(), null, null, "Project created", "Admin", "Project 'Technical Documentation' initialized.");

        // Task 5.1 (John)
        Task t5_1 = Task.builder()
                .projectId(p5.getId())
                .projectName(p5.getName())
                .title("Write integration guide")
                .description("Document external webhook payloads and error state headers.")
                .type(TaskType.STORY)
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(4))
                .assignedTo("EMP005")
                .assignedToName("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        t5_1 = taskRepository.save(t5_1);
        activityService.logActivity(p5.getId(), p5.getName(), t5_1.getId(), null, "Task created", "Admin", "Task 'Write integration guide' created.");

        // Task 5.2 (Infant)
        Task t5_2 = Task.builder()
                .projectId(p5.getId())
                .projectName(p5.getName())
                .title("Document database schema")
                .description("Generate ERD and document collections mappings for MongoDB.")
                .type(TaskType.STORY)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .startDate(today)
                .dueDate(today.plusDays(6))
                .assignedTo("EMP003")
                .assignedToName("Infant")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t5_2);
        activityService.logActivity(p5.getId(), p5.getName(), t5_2.getId(), null, "Task created", "Admin", "Task 'Document database schema' created.");

        // Task 5.3 (Arun)
        Task t5_3 = Task.builder()
                .projectId(p5.getId())
                .projectName(p5.getName())
                .title("Create Postman collection")
                .description("Export base JSON schema templates for project endpoint calls.")
                .type(TaskType.TASK)
                .status(TaskStatus.COMPLETED)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(3))
                .assignedTo("EMP001")
                .assignedToName("Arun")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t5_3);
        activityService.logActivity(p5.getId(), p5.getName(), t5_3.getId(), null, "Task created", "Admin", "Task 'Create Postman collection' created.");

        // Task 5.4 (Kavi)
        Task t5_4 = Task.builder()
                .projectId(p5.getId())
                .projectName(p5.getName())
                .title("Fix broken links")
                .description("Scan user guide directories and fix broken links.")
                .type(TaskType.BUG)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(2))
                .assignedTo("EMP004")
                .assignedToName("Kavi")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t5_4);
        activityService.logActivity(p5.getId(), p5.getName(), t5_4.getId(), null, "Task created", "Admin", "Task 'Fix broken links' created.");

        // Task 5.5 (Aswin)
        Task t5_5 = Task.builder()
                .projectId(p5.getId())
                .projectName(p5.getName())
                .title("Write markdown SOPs")
                .description("Formulate release deployment guidelines.")
                .type(TaskType.STORY)
                .status(TaskStatus.TODO)
                .priority(TaskPriority.LOW)
                .startDate(today)
                .dueDate(today.plusDays(5))
                .assignedTo("EMP002")
                .assignedToName("Aswin")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        taskRepository.save(t5_5);
        activityService.logActivity(p5.getId(), p5.getName(), t5_5.getId(), null, "Task created", "Admin", "Task 'Write markdown SOPs' created.");
    }
}
