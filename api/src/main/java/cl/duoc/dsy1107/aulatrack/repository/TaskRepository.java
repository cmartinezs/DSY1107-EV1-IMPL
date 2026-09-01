package cl.duoc.dsy1107.aulatrack.repository;

import cl.duoc.dsy1107.aulatrack.domain.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCourseId(Long courseId);
}
