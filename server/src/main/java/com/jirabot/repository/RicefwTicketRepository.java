package com.jirabot.repository;

import com.jirabot.entity.RicefwTicket;
import com.jirabot.entity.RicefwType;
import com.jirabot.entity.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RicefwTicketRepository extends JpaRepository<RicefwTicket, Long> {

    // Find by JIRA ticket key
    Optional<RicefwTicket> findByJiraTicketKey(String jiraTicketKey);

    // Find by JIRA ticket ID
    Optional<RicefwTicket> findByJiraTicketId(String jiraTicketId);

    // Find by RICEFW type
    List<RicefwTicket> findByRicefwType(RicefwType ricefwType);

    // Find by status
    List<RicefwTicket> findByStatus(TicketStatus status);

    // Find by assignee
    List<RicefwTicket> findByAssignee(String assignee);

    // Find by reporter
    List<RicefwTicket> findByReporter(String reporter);

    // Find tickets due before a certain date
    List<RicefwTicket> findByDueDateBefore(LocalDate date);

    // Find tickets created by a user
    List<RicefwTicket> findByCreatedBy(String createdBy);

    // Find tickets with specific status and RICEFW type
    List<RicefwTicket> findByStatusAndRicefwType(TicketStatus status, RicefwType ricefwType);

    // Search tickets by title containing text (case insensitive)
    Page<RicefwTicket> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // Search tickets by description containing text
    @Query("SELECT r FROM RicefwTicket r WHERE LOWER(r.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    Page<RicefwTicket> findByDescriptionContaining(@Param("description") String description, Pageable pageable);

    // Complex search query
    @Query("SELECT r FROM RicefwTicket r WHERE " +
            "(:title IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:ricefwType IS NULL OR r.ricefwType = :ricefwType) AND " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:assignee IS NULL OR LOWER(r.assignee) LIKE LOWER(CONCAT('%', :assignee, '%')))")
    Page<RicefwTicket> searchTickets(@Param("title") String title,
            @Param("ricefwType") RicefwType ricefwType,
            @Param("status") TicketStatus status,
            @Param("assignee") String assignee,
            Pageable pageable);

    // Count tickets by status
    @Query("SELECT r.status, COUNT(r) FROM RicefwTicket r GROUP BY r.status")
    List<Object[]> countTicketsByStatus();

    // Count tickets by RICEFW type
    @Query("SELECT r.ricefwType, COUNT(r) FROM RicefwTicket r GROUP BY r.ricefwType")
    List<Object[]> countTicketsByRicefwType();

    // Find overdue tickets
    @Query("SELECT r FROM RicefwTicket r WHERE r.dueDate < CURRENT_DATE AND r.status NOT IN ('COMPLETED', 'CANCELLED', 'CLOSED')")
    List<RicefwTicket> findOverdueTickets();

    // Find tickets without JIRA integration
    @Query("SELECT r FROM RicefwTicket r WHERE r.jiraTicketKey IS NULL OR r.jiraTicketId IS NULL")
    List<RicefwTicket> findTicketsWithoutJiraIntegration();
}
