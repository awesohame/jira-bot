package com.jirabot.dto;

import jakarta.validation.constraints.NotBlank;

public class JiraProjectRequest {

    @NotBlank(message = "Atlassian domain is required")
    private String atlassianDomain;

    private String email;

    private String apiToken;

    private String searchQuery;
    private Integer maxResults = 50;
    private Integer startAt = 0;

    // Constructors
    public JiraProjectRequest() {
    }

    public JiraProjectRequest(String atlassianDomain, String email, String apiToken) {
        this.atlassianDomain = atlassianDomain;
        this.email = email;
        this.apiToken = apiToken;
    }

    // Getters and Setters
    public String getAtlassianDomain() {
        return atlassianDomain;
    }

    public void setAtlassianDomain(String atlassianDomain) {
        this.atlassianDomain = atlassianDomain;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }

    public String getSearchQuery() {
        return searchQuery;
    }

    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }

    public Integer getMaxResults() {
        return maxResults;
    }

    public void setMaxResults(Integer maxResults) {
        this.maxResults = maxResults;
    }

    public Integer getStartAt() {
        return startAt;
    }

    public void setStartAt(Integer startAt) {
        this.startAt = startAt;
    }
}
