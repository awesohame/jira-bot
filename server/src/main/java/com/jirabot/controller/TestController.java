package com.jirabot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class TestController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "JIRA RICEFW Server is running");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "jira-ricefw-backend");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "JIRA RICEFW Updates Server");
        response.put("version", "0.0.1-SNAPSHOT");
        response.put("description", "Backend service for managing JIRA RICEFW updates");
        response.put("features", new String[] {
                "JIRA API Integration",
                "RICEFW Ticket Management",
                "Bulk Operations",
                "Template Management"
        });
        return ResponseEntity.ok(response);
    }

    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Echo successful");
        response.put("receivedData", payload);
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/jira-test")
    public ResponseEntity<Map<String, Object>> jiraTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "JIRA integration endpoint ready");
        response.put("note", "This will be used for JIRA API token validation");
        response.put("status", "not_implemented");
        return ResponseEntity.ok(response);
    }
}
