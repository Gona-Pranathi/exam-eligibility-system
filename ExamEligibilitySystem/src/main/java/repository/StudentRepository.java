package repository;

import entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Student findByRollNo(String rollNo);

    List<Student> findByRole(String role); // ✅ ADD THIS

}
