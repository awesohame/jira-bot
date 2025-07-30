package com.jirabot.service;

import com.jirabot.dto.JiraProjectRequest;
import com.jirabot.dto.JiraProjectResponse;
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
                    "id,key,summary,status,priority,assignee,created,updated,issuetype");

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
}
