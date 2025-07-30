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
import java.util.Base64;

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
}
