package com.jirabot.controller;

import com.jirabot.dto.JiraProjectRequest;
import com.jirabot.dto.JiraProjectResponse;
import com.jirabot.dto.CreateIssueRequest;
import com.jirabot.entity.User;
import com.jirabot.service.AuthService;
import com.jirabot.service.JiraService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174" })
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private JiraService jiraService;

    @Autowired
    private AuthService authService;

    @PostMapping("/search")
    public ResponseEntity<?> searchProjects(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody JiraProjectRequest request) {

        try {
            // Extract and validate session token
            String sessionToken = extractToken(authHeader);
            if (sessionToken == null) {
                return ResponseEntity.badRequest().body("Invalid authorization header");
            }

            // Get user by session token
            Optional<User> userOptional = authService.getUserByToken(sessionToken);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired session");
            }

            User user = userOptional.get();

            // Use user's stored email and JIRA token if not provided in request
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                request.setEmail(user.getEmail());
            }

            if (request.getApiToken() == null || request.getApiToken().trim().isEmpty()) {
                if (user.getJiraToken() == null) {
                    return ResponseEntity.badRequest()
                            .body("No JIRA token found for user. Please update your profile.");
                }
                request.setApiToken(user.getJiraToken());
            }

            logger.info("Searching projects for user: {} in domain: {}", user.getUsername(),
                    request.getAtlassianDomain());

            // Call Jira API
            JiraProjectResponse jiraResponse = jiraService.getProjects(request);

            return ResponseEntity.ok(jiraResponse);

        } catch (Exception e) {
            logger.error("Error searching projects: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching projects: " + e.getMessage());
        }
    }

    @GetMapping("/{projectKey}/issues")
    public ResponseEntity<?> getProjectIssues(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String projectKey) {

        try {
            // Extract and validate session token
            String sessionToken = extractToken(authHeader);
            if (sessionToken == null) {
                return ResponseEntity.badRequest().body("Invalid authorization header");
            }

            // Get user by session token
            Optional<User> userOptional = authService.getUserByToken(sessionToken);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired session");
            }

            User user = userOptional.get();

            if (user.getJiraToken() == null) {
                return ResponseEntity.badRequest()
                        .body("No JIRA token found for user. Please update your profile.");
            }

            logger.info("Fetching issues for project: {} for user: {}", projectKey, user.getUsername());

            // Call Jira API to get project issues
            Object jiraResponse = jiraService.getProjectIssues(projectKey, user.getEmail(), user.getJiraToken());

            return ResponseEntity.ok(jiraResponse);

        } catch (Exception e) {
            logger.error("Error fetching project issues: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching project issues: " + e.getMessage());
        }
    }

    @PostMapping("/{projectKey}/issues")
    public ResponseEntity<?> createIssue(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String projectKey,
            @RequestBody CreateIssueRequest request) {

        try {
            // Extract and validate session token
            String sessionToken = extractToken(authHeader);
            if (sessionToken == null) {
                return ResponseEntity.badRequest().body("Invalid authorization header");
            }

            // Get user by session token
            Optional<User> userOptional = authService.getUserByToken(sessionToken);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired session");
            }

            User user = userOptional.get();

            // Check if user has JIRA token
            if (user.getJiraToken() == null || user.getJiraToken().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("No JIRA token found for user. Please update your profile.");
            }

            logger.info("Creating issue in project: {} for user: {}", projectKey, user.getUsername());

            // Call Jira API to create issue
            Object jiraResponse = jiraService.createIssue(projectKey, user.getEmail(), user.getJiraToken(), request);

            return ResponseEntity.ok(jiraResponse);

        } catch (Exception e) {
            logger.error("Error creating issue: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating issue: " + e.getMessage());
        }
    }

    @PutMapping("/issues/{issueKey}/labels")
    public ResponseEntity<?> updateIssueLabels(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String issueKey,
            @RequestBody UpdateLabelsRequest request) {

        try {
            // Extract and validate session token
            String sessionToken = extractToken(authHeader);
            if (sessionToken == null) {
                return ResponseEntity.badRequest().body("Invalid authorization header");
            }

            // Get user by session token
            Optional<User> userOptional = authService.getUserByToken(sessionToken);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired session");
            }

            User user = userOptional.get();

            // Check if user has JIRA token
            if (user.getJiraToken() == null || user.getJiraToken().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("No JIRA token found for user. Please update your profile.");
            }

            logger.info("Updating labels for issue: {} to category: {} for user: {}",
                    issueKey, request.getRicefwCategory(), user.getUsername());

            // Call Jira API to update issue labels
            jiraService.updateIssueLabels(issueKey, user.getEmail(), user.getJiraToken(), request.getRicefwCategory());

            return ResponseEntity.ok().body("Labels updated successfully");

        } catch (Exception e) {
            logger.error("Error updating issue labels: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating issue labels: " + e.getMessage());
        }
    }

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // DTO for update labels request
    public static class UpdateLabelsRequest {
        private String ricefwCategory;

        public String getRicefwCategory() {
            return ricefwCategory;
        }

        public void setRicefwCategory(String ricefwCategory) {
            this.ricefwCategory = ricefwCategory;
        }
    }
}
