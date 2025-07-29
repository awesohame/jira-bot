package com.jirabot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "jira_configurations")
public class JiraConfiguration extends BaseEntity {

    @NotBlank(message = "Configuration name is required")
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @NotBlank(message = "JIRA URL is required")
    @Column(name = "jira_url", nullable = false)
    private String jiraUrl;

    @NotBlank(message = "Project key is required")
    @Column(name = "project_key", nullable = false)
    private String projectKey;

    @Column(name = "project_name")
    private String projectName;

    @NotBlank(message = "Username is required")
    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "api_token")
    private String apiToken; // This should be encrypted in production

    @Column(name = "default_issue_type")
    private String defaultIssueType = "Task";

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "description")
    private String description;

    // Constructors
    public JiraConfiguration() {
    }

    public JiraConfiguration(String name, String jiraUrl, String projectKey, String username) {
        this.name = name;
        this.jiraUrl = jiraUrl;
        this.projectKey = projectKey;
        this.username = username;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJiraUrl() {
        return jiraUrl;
    }

    public void setJiraUrl(String jiraUrl) {
        this.jiraUrl = jiraUrl;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }

    public String getDefaultIssueType() {
        return defaultIssueType;
    }

    public void setDefaultIssueType(String defaultIssueType) {
        this.defaultIssueType = defaultIssueType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
