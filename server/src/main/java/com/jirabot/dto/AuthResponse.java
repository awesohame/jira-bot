package com.jirabot.dto;

public class AuthResponse {

    private String message;
    private boolean success;
    private String username;
    private String email;
    private String token; // Session token for authentication
    private String jiraToken; // User's JIRA token

    // Constructors
    public AuthResponse() {
    }

    public AuthResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public AuthResponse(String message, boolean success, String username, String email, String token) {
        this.message = message;
        this.success = success;
        this.username = username;
        this.email = email;
        this.token = token;
    }

    public AuthResponse(String message, boolean success, String username, String email, String token,
            String jiraToken) {
        this.message = message;
        this.success = success;
        this.username = username;
        this.email = email;
        this.token = token;
        this.jiraToken = jiraToken;
    }

    // Static factory methods
    public static AuthResponse success(String message, String username, String email, String token) {
        return new AuthResponse(message, true, username, email, token);
    }

    public static AuthResponse success(String message, String username, String email, String token, String jiraToken) {
        return new AuthResponse(message, true, username, email, token, jiraToken);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(message, false);
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getJiraToken() {
        return jiraToken;
    }

    public void setJiraToken(String jiraToken) {
        this.jiraToken = jiraToken;
    }
}
