package com.jirabot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JiraProjectResponse {

    private String self;
    private Integer maxResults;
    private Integer startAt;
    private Integer total;
    private Boolean isLast;
    private List<JiraProject> values;

    // Constructors
    public JiraProjectResponse() {
    }

    // Getters and Setters
    public String getSelf() {
        return self;
    }

    public void setSelf(String self) {
        this.self = self;
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

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Boolean getIsLast() {
        return isLast;
    }

    public void setIsLast(Boolean isLast) {
        this.isLast = isLast;
    }

    public List<JiraProject> getValues() {
        return values;
    }

    public void setValues(List<JiraProject> values) {
        this.values = values;
    }
}
