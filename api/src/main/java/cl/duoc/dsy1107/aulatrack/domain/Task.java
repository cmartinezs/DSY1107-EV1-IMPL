package cl.duoc.dsy1107.aulatrack.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TaskStatus status = TaskStatus.TODO;

    private LocalDate dueDate;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Course course;

    protected Task() {}

    public Task(String title, String description, TaskStatus status, LocalDate dueDate, Course course) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
        this.course = course;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}
