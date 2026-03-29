package repository;

import org.springframework.data.jpa.repository.JpaRepository;
import entity.Eligibility;

public interface EligibilityRepository extends JpaRepository<Eligibility, Long> {

}
