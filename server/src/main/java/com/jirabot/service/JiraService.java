package com.jirabot.service;

import com.jirabot.dto.JiraProjectRequest;
import com.jirabot.dto.JiraProjectResponse;
import com.jirabot.dto.CreateIssueRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class JiraService {

    private static final Logger logger = LoggerFactory.getLogger(JiraService.class);

    @Autowired
    private RestTemplate restTemplate;

    public JiraProjectResponse getProjects(JiraProjectRequest request) {
        try {
            // Construct the Jira API URL
            String baseUrl = String.format("https://%s.atlassian.net/rest/api/3/project/search",
                    request.getAtlassianDomain());

            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("maxResults", request.getMaxResults())
                    .queryParam("startAt", request.getStartAt());

            // Add search query if provided
            if (request.getSearchQuery() != null && !request.getSearchQuery().trim().isEmpty()) {
                uriBuilder.queryParam("query", request.getSearchQuery().trim());
            }

            String url = uriBuilder.toUriString();

            // Create Basic Auth header
            String auth = request.getEmail() + ":" + request.getApiToken();
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            String authHeader = "Basic " + new String(encodedAuth);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            logger.info("Calling Jira API: {} for domain: {}", url, request.getAtlassianDomain());

            // Make the API call
            ResponseEntity<JiraProjectResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    JiraProjectResponse.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Successfully fetched {} projects from Jira",
                        response.getBody() != null ? response.getBody().getValues().size() : 0);
                return response.getBody();
            } else {
                logger.error("Failed to fetch projects from Jira. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to fetch projects from Jira");
            }

        } catch (Exception e) {
            logger.error("Error calling Jira API: ", e);
            throw new RuntimeException("Error fetching projects from Jira: " + e.getMessage());
        }
    }

    public Object getProjectIssues(String projectKey, String email, String apiToken) {
        try {
            // Extract domain from email (assuming email format like user@domain.com)
            String domain = extractDomainFromEmail(email);

            logger.info("Extracted domain '{}' from email '{}' for user", domain, email);

            // Construct the URL with proper JQL format: project=PROJECT_KEY
            String baseUrl = String.format("https://%s.atlassian.net/rest/api/3/search", domain);
            String jqlQuery = "project=" + projectKey;

            // Build URL manually to avoid double encoding of JQL query
            String url = String.format("%s?jql=%s&maxResults=%d&startAt=%d&fields=%s",
                    baseUrl,
                    jqlQuery,
                    50,
                    0,
                    "id,key,summary,status,priority,assignee,created,updated,issuetype,labels");

            // Create Basic Auth header
            String auth = email + ":" + apiToken;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            String authHeader = "Basic " + new String(encodedAuth);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            logger.info("Calling Jira API for project issues: {} for project: {}", url, projectKey);

            // Make the API call
            ResponseEntity<Object> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    Object.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Successfully fetched issues for project: {}", projectKey);
                return transformIssuesResponse(response.getBody());
            } else {
                logger.error("Failed to fetch issues from Jira. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to fetch issues from Jira");
            }

        } catch (Exception e) {
            logger.error("Error calling Jira API for issues: ", e);
            throw new RuntimeException("Error fetching issues from Jira: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private Object transformIssuesResponse(Object rawResponse) {
        try {
            if (rawResponse instanceof Map) {
                Map<String, Object> responseMap = (Map<String, Object>) rawResponse;
                Map<String, Object> transformedResponse = new HashMap<>();

                // Copy metadata fields
                transformedResponse.put("expand", responseMap.get("expand"));
                transformedResponse.put("startAt", responseMap.get("startAt"));
                transformedResponse.put("maxResults", responseMap.get("maxResults"));
                transformedResponse.put("total", responseMap.get("total"));

                // Transform issues array to flatten fields for frontend consumption
                if (responseMap.get("issues") instanceof List) {
                    List<Map<String, Object>> issues = (List<Map<String, Object>>) responseMap.get("issues");
                    List<Map<String, Object>> transformedIssues = new ArrayList<>();

                    for (Map<String, Object> issue : issues) {
                        Map<String, Object> transformedIssue = new HashMap<>();

                        // Copy root level fields
                        transformedIssue.put("id", issue.get("id"));
                        transformedIssue.put("key", issue.get("key"));
                        transformedIssue.put("self", issue.get("self"));

                        // Extract fields from nested "fields" object
                        if (issue.get("fields") instanceof Map) {
                            Map<String, Object> fields = (Map<String, Object>) issue.get("fields");

                            // Flatten important fields to root level for easier frontend access
                            transformedIssue.put("summary", fields.get("summary"));
                            transformedIssue.put("status", fields.get("status"));
                            transformedIssue.put("priority", fields.get("priority"));
                            transformedIssue.put("assignee", fields.get("assignee"));
                            transformedIssue.put("created", fields.get("created"));
                            transformedIssue.put("updated", fields.get("updated"));
                            transformedIssue.put("issueType", fields.get("issuetype")); // Note: JIRA uses "issuetype"
                            transformedIssue.put("labels", fields.get("labels")); // Add labels field
                        }

                        transformedIssues.add(transformedIssue);
                    }

                    transformedResponse.put("issues", transformedIssues);
                } else {
                    // If no issues found, return empty array
                    transformedResponse.put("issues", new ArrayList<>());
                }

                return transformedResponse;
            }

            return rawResponse;
        } catch (Exception e) {
            logger.error("Error transforming issues response: ", e);
            return rawResponse; // Return original response if transformation fails
        }
    }

    private String extractDomainFromEmail(String email) {
        // FIXME: This is a temporary workaround. The domain should be stored with the
        // user
        // For now, we'll use the known working domain from project searches
        if (email != null && email.contains("@")) {
            String domain = email.split("@")[1];
            // Remove .com, .org, etc. to get the base domain
            if (domain.contains(".")) {
                String extractedDomain = domain.split("\\.")[0];

                // Temporary hardcode for known working domain
                // TODO: Store Atlassian domain in User entity instead of extracting from email
                if ("gmail".equals(extractedDomain)) {
                    logger.warn("Email domain '{}' extracted from '{}', but using 'infectus07' as Atlassian domain",
                            extractedDomain, email);
                    return "infectus07";
                }

                return extractedDomain;
            }
            return domain;
        }
        throw new IllegalArgumentException("Invalid email format");
    }

    public void updateIssueLabels(String issueKey, String email, String apiToken, String ricefwCategory) {
        try {
            String domain = extractDomainFromEmail(email);

            logger.info("Updating labels for issue '{}' with RICEFW category '{}'", issueKey, ricefwCategory);

            // First, get the current issue to retrieve existing labels
            String getIssueUrl = String.format("https://%s.atlassian.net/rest/api/3/issue/%s?fields=labels", domain,
                    issueKey);

            // Create Basic Auth header
            String auth = email + ":" + apiToken;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            String authHeader = "Basic " + new String(encodedAuth);

            // Set headers for GET request
            HttpHeaders getHeaders = new HttpHeaders();
            getHeaders.set("Authorization", authHeader);
            getHeaders.set("Accept", "application/json");

            HttpEntity<String> getEntity = new HttpEntity<>(getHeaders);

            // Get current issue data
            ResponseEntity<Object> getResponse = restTemplate.exchange(
                    getIssueUrl,
                    HttpMethod.GET,
                    getEntity,
                    Object.class);

            // Extract current labels
            List<String> currentLabels = new ArrayList<>();
            if (getResponse.getStatusCode() == HttpStatus.OK && getResponse.getBody() != null) {
                if (getResponse.getBody() instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> issueData = (Map<String, Object>) getResponse.getBody();
                    if (issueData.get("fields") instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> fields = (Map<String, Object>) issueData.get("fields");
                        if (fields.get("labels") instanceof List) {
                            @SuppressWarnings("unchecked")
                            List<String> labels = (List<String>) fields.get("labels");
                            currentLabels.addAll(labels);
                        }
                    }
                }
            }

            // Remove any existing RICEFW category labels
            List<String> ricefwCategories = Arrays.asList("Report", "Interface", "Conversion", "Enhancement", "Form",
                    "Workflow");
            currentLabels.removeIf(ricefwCategories::contains);

            // Add the new RICEFW category if it's not "Uncategorized"
            if (!"Uncategorized".equals(ricefwCategory)) {
                currentLabels.add(ricefwCategory);
            }

            // Construct the JIRA API URL for updating issue
            String updateIssueUrl = String.format("https://%s.atlassian.net/rest/api/3/issue/%s", domain, issueKey);

            // Create the request body for updating labels with all preserved labels
            StringBuilder labelsJson = new StringBuilder();
            labelsJson.append("[");
            for (int i = 0; i < currentLabels.size(); i++) {
                if (i > 0)
                    labelsJson.append(", ");
                labelsJson.append("\"").append(currentLabels.get(i)).append("\"");
            }
            labelsJson.append("]");

            String requestBody = String.format("""
                    {
                      "update": {
                        "labels": [
                          { "set": %s }
                        ]
                      }
                    }
                    """, labelsJson.toString());

            // Set headers for PUT request
            HttpHeaders putHeaders = new HttpHeaders();
            putHeaders.set("Authorization", authHeader);
            putHeaders.set("Content-Type", "application/json");
            putHeaders.set("Accept", "application/json");

            HttpEntity<String> putEntity = new HttpEntity<>(requestBody, putHeaders);

            logger.info("Calling JIRA API to update issue labels: {} with body: {}", updateIssueUrl, requestBody);

            // Make the API call
            ResponseEntity<Object> response = restTemplate.exchange(
                    updateIssueUrl,
                    HttpMethod.PUT,
                    putEntity,
                    Object.class);

            if (response.getStatusCode() == HttpStatus.NO_CONTENT || response.getStatusCode() == HttpStatus.OK) {
                logger.info("Successfully updated labels for issue: {} with preserved non-RICEFW labels", issueKey);
            } else {
                logger.error("Failed to update labels for issue: {}. Status: {}", issueKey, response.getStatusCode());
                throw new RuntimeException("Failed to update issue labels: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error updating labels for issue {}: {}", issueKey, e.getMessage(), e);
            throw new RuntimeException("Error updating labels for issue: " + e.getMessage(), e);
        }
    }

    public Object createIssue(String projectKey, String email, String apiToken, CreateIssueRequest request) {
        try {
            String domain = extractDomainFromEmail(email);
            
            logger.info("Creating issue in project '{}' with summary '{}'", projectKey, request.getSummary());

            // Construct the JIRA API URL for creating issue
            String createIssueUrl = String.format("https://%s.atlassian.net/rest/api/3/issue", domain);

            // Create Basic Auth header
            String auth = email + ":" + apiToken;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            String authHeader = "Basic " + new String(encodedAuth);

            // Construct labels array for request body
            StringBuilder labelsJson = new StringBuilder();
            labelsJson.append("[");
            if (request.getLabels() != null && !request.getLabels().isEmpty()) {
                for (int i = 0; i < request.getLabels().size(); i++) {
                    if (i > 0) labelsJson.append(", ");
                    labelsJson.append("\"").append(request.getLabels().get(i)).append("\"");
                }
            }
            labelsJson.append("]");

            // Create description in Atlassian Document Format (ADF)
            String descriptionADF = "";
            if (request.getDescription() != null && !request.getDescription().trim().isEmpty()) {
                String escapedDescription = request.getDescription().replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
                descriptionADF = String.format("""
                    "description": {
                      "type": "doc",
                      "version": 1,
                      "content": [
                        {
                          "type": "paragraph",
                          "content": [
                            {
                              "type": "text",
                              "text": "%s"
                            }
                          ]
                        }
                      ]
                    },""", escapedDescription);
            } else {
                descriptionADF = "";
            }

            // Create the request body
            String requestBody = String.format("""
                {
                  "fields": {
                    "project": {
                      "key": "%s"
                    },
                    "summary": "%s",
                    %s
                    "issuetype": {
                      "name": "%s"
                    },
                    "priority": {
                      "name": "%s"
                    },
                    "labels": %s
                  }
                }
                """, 
                projectKey,
                request.getSummary().replace("\"", "\\\""),
                descriptionADF,
                request.getIssueTypeName() != null ? request.getIssueTypeName() : "Task",
                request.getPriorityName() != null ? request.getPriorityName() : "Medium",
                labelsJson.toString());

            // Set headers for POST request
            HttpHeaders postHeaders = new HttpHeaders();
            postHeaders.set("Authorization", authHeader);
            postHeaders.set("Content-Type", "application/json");
            postHeaders.set("Accept", "application/json");

            HttpEntity<String> postEntity = new HttpEntity<>(requestBody, postHeaders);

            logger.info("Calling JIRA API to create issue: {} with body: {}", createIssueUrl, requestBody);

            // Make the API call
            ResponseEntity<Object> response = restTemplate.exchange(
                    createIssueUrl,
                    HttpMethod.POST,
                    postEntity,
                    Object.class);

            if (response.getStatusCode() == HttpStatus.CREATED || response.getStatusCode() == HttpStatus.OK) {
                logger.info("Successfully created issue in project: {}", projectKey);
                return response.getBody();
            } else {
                logger.error("Failed to create issue in project: {}. Status: {}", projectKey, response.getStatusCode());
                throw new RuntimeException("Failed to create issue: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error creating issue in project {}: {}", projectKey, e.getMessage(), e);
            throw new RuntimeException("Error creating issue: " + e.getMessage(), e);
        }
    }

    /**
     * Get available transitions for an issue
     */
    public Object getIssueTransitions(String issueKey, String email, String jiraToken) {
        try {
            String domain = extractDomainFromEmail(email);
            String transitionsUrl = String.format("https://%s.atlassian.net/rest/api/3/issue/%s/transitions", 
                    domain, issueKey);

            // Create Basic Auth header
            String auth = email + ":" + jiraToken;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            String authHeader = "Basic " + new String(encodedAuth);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            logger.info("Fetching transitions for issue: {} from URL: {}", issueKey, transitionsUrl);

            // Make the API call
            ResponseEntity<Object> response = restTemplate.exchange(
                    transitionsUrl,
                    HttpMethod.GET,
                    entity,
                    Object.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Successfully fetched transitions for issue: {}", issueKey);
                return response.getBody();
            } else {
                logger.error("Failed to fetch transitions for issue: {}. Status: {}", issueKey, response.getStatusCode());
                throw new RuntimeException("Failed to fetch transitions: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error fetching transitions for issue {}: {}", issueKey, e.getMessage(), e);
            throw new RuntimeException("Error fetching transitions: " + e.getMessage(), e);
        }
    }

    /**
     * Apply a transition to change issue status
     */
    public Object transitionIssue(String issueKey, String transitionId, String email, String jiraToken) {
        try {
            String domain = extractDomainFromEmail(email);
            String transitionUrl = String.format("https://%s.atlassian.net/rest/api/3/issue/%s/transitions", 
                    domain, issueKey);

            // Create Basic Auth header
            String auth = email + ":" + jiraToken;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            String authHeader = "Basic " + new String(encodedAuth);

            // Create request body
            String requestBody = String.format("""
                {
                  "transition": {
                    "id": "%s"
                  }
                }
                """, transitionId);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            logger.info("Applying transition {} to issue: {} with URL: {}", transitionId, issueKey, transitionUrl);
            logger.info("Transition request body: {}", requestBody);

            // Make the API call
            ResponseEntity<Object> response = restTemplate.exchange(
                    transitionUrl,
                    HttpMethod.POST,
                    entity,
                    Object.class);

            if (response.getStatusCode() == HttpStatus.NO_CONTENT || response.getStatusCode() == HttpStatus.OK) {
                logger.info("Successfully applied transition {} to issue: {}", transitionId, issueKey);
                return Map.of("success", true, "message", "Transition applied successfully");
            } else {
                logger.error("Failed to apply transition {} to issue: {}. Status: {}", transitionId, issueKey, response.getStatusCode());
                throw new RuntimeException("Failed to apply transition: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error applying transition {} to issue {}: {}", transitionId, issueKey, e.getMessage(), e);
            throw new RuntimeException("Error applying transition: " + e.getMessage(), e);
        }
    }
}
