package com.jirabot.controller;

import com.jirabot.entity.*;
import com.jirabot.repository.RicefwTicketRepository;
import com.jirabot.repository.JiraConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/ricefw")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174" })
public class RicefwController {

    @Autowired
    private RicefwTicketRepository ricefwTicketRepository;

    @Autowired
    private JiraConfigurationRepository jiraConfigurationRepository;

    @GetMapping("/tickets")
    public ResponseEntity<Map<String, Object>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<RicefwTicket> ticketPage = ricefwTicketRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("tickets", ticketPage.getContent());
        response.put("currentPage", ticketPage.getNumber());
        response.put("totalPages", ticketPage.getTotalPages());
        response.put("totalElements", ticketPage.getTotalElements());
        response.put("hasNext", ticketPage.hasNext());
        response.put("hasPrevious", ticketPage.hasPrevious());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<RicefwTicket> getTicketById(@PathVariable Long id) {
        Optional<RicefwTicket> ticket = ricefwTicketRepository.findById(id);
        return ticket.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tickets")
    public ResponseEntity<RicefwTicket> createTicket(@RequestBody RicefwTicket ticket) {
        RicefwTicket savedTicket = ricefwTicketRepository.save(ticket);
        return ResponseEntity.ok(savedTicket);
    }

    @PutMapping("/tickets/{id}")
    public ResponseEntity<RicefwTicket> updateTicket(@PathVariable Long id, @RequestBody RicefwTicket ticket) {
        if (!ricefwTicketRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ticket.setId(id);
        RicefwTicket updatedTicket = ricefwTicketRepository.save(ticket);
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        if (!ricefwTicketRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ricefwTicketRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tickets/search")
    public ResponseEntity<Page<RicefwTicket>> searchTickets(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String ricefwType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignee,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Convert string parameters to enums with proper error handling
        RicefwType ricefwTypeEnum = null;
        if (ricefwType != null && !ricefwType.trim().isEmpty()) {
            try {
                ricefwTypeEnum = RicefwType.valueOf(ricefwType.toUpperCase());
            } catch (IllegalArgumentException e) {
                // If enum value is invalid, try to match by display name
                for (RicefwType type : RicefwType.values()) {
                    if (type.getDisplayName().equalsIgnoreCase(ricefwType)) {
                        ricefwTypeEnum = type;
                        break;
                    }
                }
            }
        }

        TicketStatus statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                statusEnum = TicketStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // If enum value is invalid, ignore it for now
                System.err.println("Invalid status value: " + status);
            }
        }

        Page<RicefwTicket> tickets = ricefwTicketRepository.searchTickets(title, ricefwTypeEnum, statusEnum, assignee,
                pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/tickets/type/{type}")
    public ResponseEntity<List<RicefwTicket>> getTicketsByType(@PathVariable String type) {
        try {
            RicefwType ricefwType = null;

            // Try to parse as enum first
            try {
                ricefwType = RicefwType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Try to match by display name
                for (RicefwType t : RicefwType.values()) {
                    if (t.getDisplayName().equalsIgnoreCase(type)) {
                        ricefwType = t;
                        break;
                    }
                }
            }

            if (ricefwType == null) {
                return ResponseEntity.badRequest().build();
            }

            List<RicefwTicket> tickets = ricefwTicketRepository.findByRicefwType(ricefwType);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            System.err.println("Error getting tickets by type: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/tickets/status/{status}")
    public ResponseEntity<List<RicefwTicket>> getTicketsByStatus(@PathVariable TicketStatus status) {
        List<RicefwTicket> tickets = ricefwTicketRepository.findByStatus(status);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/tickets/assignee/{assignee}")
    public ResponseEntity<List<RicefwTicket>> getTicketsByAssignee(@PathVariable String assignee) {
        List<RicefwTicket> tickets = ricefwTicketRepository.findByAssignee(assignee);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/tickets/overdue")
    public ResponseEntity<List<RicefwTicket>> getOverdueTickets() {
        List<RicefwTicket> tickets = ricefwTicketRepository.findOverdueTickets();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/stats/status")
    public ResponseEntity<Map<String, Long>> getTicketStatusStats() {
        List<Object[]> results = ricefwTicketRepository.countTicketsByStatus();
        Map<String, Long> stats = new HashMap<>();
        for (Object[] result : results) {
            stats.put(result[0].toString(), (Long) result[1]);
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/type")
    public ResponseEntity<Map<String, Long>> getTicketTypeStats() {
        List<Object[]> results = ricefwTicketRepository.countTicketsByRicefwType();
        Map<String, Long> stats = new HashMap<>();
        for (Object[] result : results) {
            stats.put(result[0].toString(), (Long) result[1]);
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/configurations")
    public ResponseEntity<List<JiraConfiguration>> getAllConfigurations() {
        List<JiraConfiguration> configurations = jiraConfigurationRepository.findAll();
        return ResponseEntity.ok(configurations);
    }

    @GetMapping("/configurations/active")
    public ResponseEntity<List<JiraConfiguration>> getActiveConfigurations() {
        List<JiraConfiguration> configurations = jiraConfigurationRepository.findByIsActiveTrue();
        return ResponseEntity.ok(configurations);
    }

    @GetMapping("/types")
    public ResponseEntity<Map<String, Object>> getRicefwTypes() {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> types = new HashMap<>();

        for (RicefwType type : RicefwType.values()) {
            types.put(type.name(), type.getDisplayName());
        }

        response.put("types", types);
        response.put("available", RicefwType.values());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/configurations")
    public ResponseEntity<JiraConfiguration> createConfiguration(@RequestBody JiraConfiguration configuration) {
        JiraConfiguration savedConfig = jiraConfigurationRepository.save(configuration);
        return ResponseEntity.ok(savedConfig);
    }

    // Demo endpoint to create sample data
    @PostMapping("/demo/create-sample-data")
    public ResponseEntity<Map<String, Object>> createSampleData() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Create sample JIRA configuration
            JiraConfiguration config = new JiraConfiguration();
            config.setName("Demo JIRA");
            config.setJiraUrl("https://demo.atlassian.net");
            config.setProjectKey("DEMO");
            config.setProjectName("Demo Project");
            config.setUsername("demo@company.com");
            config.setDefaultIssueType("Task");
            config.setDescription("Demo JIRA configuration");
            jiraConfigurationRepository.save(config);

            // Create sample tickets
            RicefwTicket ticket1 = new RicefwTicket();
            ticket1.setTitle("Sample Report Enhancement");
            ticket1.setDescription("This is a sample report enhancement ticket");
            ticket1.setRicefwType(RicefwType.REPORT);
            ticket1.setStatus(TicketStatus.DRAFT);
            ticket1.setPriority(Priority.MEDIUM);
            ticket1.setAssignee("john.doe@company.com");
            ticket1.setReporter("jane.smith@company.com");
            ticket1.setBusinessRequirement("Sample business requirement");
            ticket1.setEstimatedHours(20.0);
            ticket1.setDueDate(LocalDate.now().plusWeeks(2));
            ricefwTicketRepository.save(ticket1);

            RicefwTicket ticket2 = new RicefwTicket();
            ticket2.setTitle("Sample Interface Development");
            ticket2.setDescription("This is a sample interface development ticket");
            ticket2.setRicefwType(RicefwType.INTERFACE);
            ticket2.setStatus(TicketStatus.IN_DEVELOPMENT);
            ticket2.setPriority(Priority.HIGH);
            ticket2.setAssignee("alice.johnson@company.com");
            ticket2.setReporter("bob.wilson@company.com");
            ticket2.setBusinessRequirement("Sample interface requirement");
            ticket2.setEstimatedHours(40.0);
            ticket2.setDueDate(LocalDate.now().plusMonths(1));
            ricefwTicketRepository.save(ticket2);

            response.put("message", "Sample data created successfully");
            response.put("configurationCreated", 1);
            response.put("ticketsCreated", 2);
            response.put("status", "success");

        } catch (Exception e) {
            response.put("message", "Error creating sample data: " + e.getMessage());
            response.put("status", "error");
        }

        return ResponseEntity.ok(response);
    }
}
