package com.jirabot.repository;

import com.jirabot.entity.JiraConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JiraConfigurationRepository extends JpaRepository<JiraConfiguration, Long> {

    // Find configuration by name
    Optional<JiraConfiguration> findByName(String name);

    // Find active configurations
    List<JiraConfiguration> findByIsActiveTrue();

    // Find by project key
    Optional<JiraConfiguration> findByProjectKey(String projectKey);

    // Find by JIRA URL
    List<JiraConfiguration> findByJiraUrl(String jiraUrl);

    // Find by username
    List<JiraConfiguration> findByUsername(String username);
}
