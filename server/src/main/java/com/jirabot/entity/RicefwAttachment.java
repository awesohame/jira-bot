package com.jirabot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "ricefw_attachments")
public class RicefwAttachment extends BaseEntity {

    @NotBlank(message = "Filename is required")
    @Column(name = "filename", nullable = false)
    private String filename;

    @Column(name = "original_filename")
    private String originalFilename;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ricefw_ticket_id", nullable = false)
    private RicefwTicket ricefwTicket;

    @Column(name = "jira_attachment_id")
    private String jiraAttachmentId;

    @Column(name = "description")
    private String description;

    // Constructors
    public RicefwAttachment() {
    }

    public RicefwAttachment(String filename, String contentType, Long fileSize) {
        this.filename = filename;
        this.contentType = contentType;
        this.fileSize = fileSize;
    }

    // Getters and Setters
    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public RicefwTicket getRicefwTicket() {
        return ricefwTicket;
    }

    public void setRicefwTicket(RicefwTicket ricefwTicket) {
        this.ricefwTicket = ricefwTicket;
    }

    public String getJiraAttachmentId() {
        return jiraAttachmentId;
    }

    public void setJiraAttachmentId(String jiraAttachmentId) {
        this.jiraAttachmentId = jiraAttachmentId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
