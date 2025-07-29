package com.jirabot.repository;

import com.jirabot.entity.RicefwComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RicefwCommentRepository extends JpaRepository<RicefwComment, Long> {

    // Find comments by ticket ID
    List<RicefwComment> findByRicefwTicketIdOrderByCreatedAtDesc(Long ricefwTicketId);

    // Find comments by author
    List<RicefwComment> findByAuthorOrderByCreatedAtDesc(String author);

    // Find comment by JIRA comment ID
    Optional<RicefwComment> findByJiraCommentId(String jiraCommentId);

    // Search comments by content
    @Query("SELECT c FROM RicefwComment c WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', :content, '%'))")
    List<RicefwComment> findByContentContaining(@Param("content") String content);

    // Count comments by ticket
    @Query("SELECT COUNT(c) FROM RicefwComment c WHERE c.ricefwTicket.id = :ticketId")
    Long countByTicketId(@Param("ticketId") Long ticketId);
}
