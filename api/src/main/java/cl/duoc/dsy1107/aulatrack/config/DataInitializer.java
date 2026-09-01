package cl.duoc.dsy1107.aulatrack.config;

import cl.duoc.dsy1107.aulatrack.domain.Course;
import cl.duoc.dsy1107.aulatrack.domain.Task;
import cl.duoc.dsy1107.aulatrack.domain.TaskStatus;
import cl.duoc.dsy1107.aulatrack.repository.CourseRepository;
import cl.duoc.dsy1107.aulatrack.repository.TaskRepository;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seed(CourseRepository courses, TaskRepository tasks) {
        return args -> {
            if (courses.count() > 0) {
                return;
            }

            Course cloud = courses.save(new Course("DSY1107", "Desarrollo Cloud Native I", true));
            Course mobile = courses.save(new Course("DSY1105", "Desarrollo de Aplicaciones Móviles", true));
            Course poo = courses.save(new Course("DSY1102", "Programación Orientada a Objetos", true));

            tasks.save(new Task("Preparar material EV1", "Revisar integración de identidad y API.", TaskStatus.IN_PROGRESS, LocalDate.now().plusDays(3), cloud));
            tasks.save(new Task("Actualizar desafíos", "Publicar ejercicios cortos para la semana.", TaskStatus.TODO, LocalDate.now().plusDays(5), mobile));
            tasks.save(new Task("Preparar clase de constructores", "Continuar ejercicio de cuenta y composición.", TaskStatus.TODO, LocalDate.now().plusDays(1), poo));
        };
    }
}
