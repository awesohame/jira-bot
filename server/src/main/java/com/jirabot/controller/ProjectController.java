package com.jirabot.controller;

import com.jirabot.dto.JiraProjectRequest;
import com.jirabot.dto.JiraProjectResponse;
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

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
