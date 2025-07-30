package com.jirabot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JiraProject {

    private String id;
    private String key;
    private String name;
    private String self;
    private Map<String, String> avatarUrls;
    private String projectTypeKey;
    private Boolean simplified;
    private String style;
    private Boolean isPrivate;
    private String entityId;
    private String uuid;

    // Constructors
    public JiraProject() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSelf() {
        return self;
    }

    public void setSelf(String self) {
        this.self = self;
    }

    public Map<String, String> getAvatarUrls() {
        return avatarUrls;
    }

    public void setAvatarUrls(Map<String, String> avatarUrls) {
        this.avatarUrls = avatarUrls;
    }

    public String getProjectTypeKey() {
        return projectTypeKey;
    }

    public void setProjectTypeKey(String projectTypeKey) {
        this.projectTypeKey = projectTypeKey;
    }

    public Boolean getSimplified() {
        return simplified;
    }

    public void setSimplified(Boolean simplified) {
        this.simplified = simplified;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public Boolean getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
