package com.jirabot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "ricefw_comments")
public class RicefwComment extends BaseEntity {

    @NotBlank(message = "Comment content is required")
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "author", nullable = false)
    private String author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ricefw_ticket_id", nullable = false)
    private RicefwTicket ricefwTicket;

    @Column(name = "jira_comment_id")
    private String jiraCommentId;

    // Constructors
    public RicefwComment() {
    }

    public RicefwComment(String content, String author) {
        this.content = content;
        this.author = author;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public RicefwTicket getRicefwTicket() {
        return ricefwTicket;
    }

    public void setRicefwTicket(RicefwTicket ricefwTicket) {
        this.ricefwTicket = ricefwTicket;
    }

    public String getJiraCommentId() {
        return jiraCommentId;
    }

    public void setJiraCommentId(String jiraCommentId) {
        this.jiraCommentId = jiraCommentId;
    }
}
