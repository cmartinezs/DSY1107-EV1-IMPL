package cl.duoc.dsy1107.aulatrack.repository;

import cl.duoc.dsy1107.aulatrack.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
