package com.jirabot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ricefw_tickets")
public class RicefwTicket extends BaseEntity {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "RICEFW type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "ricefw_type", nullable = false)
    private RicefwType ricefwType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TicketStatus status = TicketStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "jira_ticket_key", unique = true)
    private String jiraTicketKey;

    @Column(name = "jira_ticket_id")
    private String jiraTicketId;

    @Column(name = "assignee")
    private String assignee;

    @Column(name = "reporter")
    private String reporter;

    @Column(name = "business_requirement", columnDefinition = "TEXT")
    private String businessRequirement;

    @Column(name = "technical_specification", columnDefinition = "TEXT")
    private String technicalSpecification;

    @Column(name = "test_cases", columnDefinition = "TEXT")
    private String testCases;

    @Column(name = "deployment_instructions", columnDefinition = "TEXT")
    private String deploymentInstructions;

    @Column(name = "impact_analysis", columnDefinition = "TEXT")
    private String impactAnalysis;

    @Column(name = "estimated_hours")
    private Double estimatedHours;

    @Column(name = "actual_hours")
    private Double actualHours;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @ElementCollection
    @CollectionTable(name = "ricefw_labels", joinColumns = @JoinColumn(name = "ricefw_id"))
    @Column(name = "label")
    private List<String> labels = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "ricefw_components", joinColumns = @JoinColumn(name = "ricefw_id"))
    @Column(name = "component")
    private List<String> components = new ArrayList<>();

    @OneToMany(mappedBy = "ricefwTicket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RicefwComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "ricefwTicket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RicefwAttachment> attachments = new ArrayList<>();

    // Constructors
    public RicefwTicket() {
    }

    public RicefwTicket(String title, RicefwType ricefwType) {
        this.title = title;
        this.ricefwType = ricefwType;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RicefwType getRicefwType() {
        return ricefwType;
    }

    public void setRicefwType(RicefwType ricefwType) {
        this.ricefwType = ricefwType;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getJiraTicketKey() {
        return jiraTicketKey;
    }

    public void setJiraTicketKey(String jiraTicketKey) {
        this.jiraTicketKey = jiraTicketKey;
    }

    public String getJiraTicketId() {
        return jiraTicketId;
    }

    public void setJiraTicketId(String jiraTicketId) {
        this.jiraTicketId = jiraTicketId;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public String getBusinessRequirement() {
        return businessRequirement;
    }

    public void setBusinessRequirement(String businessRequirement) {
        this.businessRequirement = businessRequirement;
    }

    public String getTechnicalSpecification() {
        return technicalSpecification;
    }

    public void setTechnicalSpecification(String technicalSpecification) {
        this.technicalSpecification = technicalSpecification;
    }

    public String getTestCases() {
        return testCases;
    }

    public void setTestCases(String testCases) {
        this.testCases = testCases;
    }

    public String getDeploymentInstructions() {
        return deploymentInstructions;
    }

    public void setDeploymentInstructions(String deploymentInstructions) {
        this.deploymentInstructions = deploymentInstructions;
    }

    public String getImpactAnalysis() {
        return impactAnalysis;
    }

    public void setImpactAnalysis(String impactAnalysis) {
        this.impactAnalysis = impactAnalysis;
    }

    public Double getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public Double getActualHours() {
        return actualHours;
    }

    public void setActualHours(Double actualHours) {
        this.actualHours = actualHours;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDate completionDate) {
        this.completionDate = completionDate;
    }

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<String> getComponents() {
        return components;
    }

    public void setComponents(List<String> components) {
        this.components = components;
    }

    public List<RicefwComment> getComments() {
        return comments;
    }

    public void setComments(List<RicefwComment> comments) {
        this.comments = comments;
    }

    public List<RicefwAttachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<RicefwAttachment> attachments) {
        this.attachments = attachments;
    }

    // Helper methods
    public void addComment(RicefwComment comment) {
        comments.add(comment);
        comment.setRicefwTicket(this);
    }

    public void removeComment(RicefwComment comment) {
        comments.remove(comment);
        comment.setRicefwTicket(null);
    }

    public void addAttachment(RicefwAttachment attachment) {
        attachments.add(attachment);
        attachment.setRicefwTicket(this);
    }

    public void removeAttachment(RicefwAttachment attachment) {
        attachments.remove(attachment);
        attachment.setRicefwTicket(null);
    }
}
