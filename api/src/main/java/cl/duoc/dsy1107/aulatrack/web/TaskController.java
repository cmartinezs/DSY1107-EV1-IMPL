package cl.duoc.dsy1107.aulatrack.web;

import cl.duoc.dsy1107.aulatrack.domain.Course;
import cl.duoc.dsy1107.aulatrack.domain.Task;
import cl.duoc.dsy1107.aulatrack.domain.TaskStatus;
import cl.duoc.dsy1107.aulatrack.repository.CourseRepository;
import cl.duoc.dsy1107.aulatrack.repository.TaskRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository tasks;
    private final CourseRepository courses;

    public TaskController(TaskRepository tasks, CourseRepository courses) {
        this.tasks = tasks;
        this.courses = courses;
    }

    @GetMapping
    public List<Task> findAll(@RequestParam(required = false) Long courseId) {
        return courseId == null ? tasks.findAll() : tasks.findByCourseId(courseId);
    }

    @GetMapping("/{id}")
    public Task findOne(@PathVariable Long id) {
        return tasks.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task no encontrada"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@Valid @RequestBody TaskRequest request) {
        Course course = requireCourse(request.courseId());
        return tasks.save(new Task(request.title(), request.description(), request.status(), request.dueDate(), course));
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        Task task = findOne(id);
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setDueDate(request.dueDate());
        task.setCourse(requireCourse(request.courseId()));
        return tasks.save(task);
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        Task task = findOne(id);
        task.setStatus(request.status());
        return tasks.save(task);
    }

    private Course requireCourse(Long courseId) {
        return courses.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course inexistente"));
    }

    public record TaskRequest(
            @NotBlank String title,
            String description,
            @NotNull TaskStatus status,
            LocalDate dueDate,
            @NotNull Long courseId
    ) {}

    public record StatusRequest(@NotNull TaskStatus status) {}
}
