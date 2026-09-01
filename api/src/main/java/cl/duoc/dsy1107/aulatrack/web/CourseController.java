package cl.duoc.dsy1107.aulatrack.web;

import cl.duoc.dsy1107.aulatrack.domain.Course;
import cl.duoc.dsy1107.aulatrack.repository.CourseRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseRepository courses;

    public CourseController(CourseRepository courses) {
        this.courses = courses;
    }

    @GetMapping
    public List<Course> findAll() {
        return courses.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course create(@Valid @RequestBody Course course) {
        return courses.save(new Course(course.getCode(), course.getName(), course.isActive()));
    }
}
