package repository;

import org.springframework.data.jpa.repository.JpaRepository;
import entity.HallTicket;

public interface HallTicketRepository extends JpaRepository<HallTicket, Long> {

}