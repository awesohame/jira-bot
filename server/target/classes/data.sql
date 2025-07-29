-- Insert sample JIRA configurations
INSERT INTO jira_configurations (name, jira_url, project_key, project_name, username, default_issue_type, is_active, description, created_at, updated_at, created_by, updated_by)
VALUES 
    ('Default JIRA', 'https://your-company.atlassian.net', 'RICEFW', 'RICEFW Project', 'admin@company.com', 'Task', true, 'Default JIRA configuration for RICEFW tickets', NOW(), NOW(), 'system', 'system'),
    ('Test JIRA', 'https://test-company.atlassian.net', 'TEST', 'Test Project', 'test@company.com', 'Story', false, 'Test JIRA configuration', NOW(), NOW(), 'system', 'system');

-- Insert sample RICEFW tickets
INSERT INTO ricefw_tickets (title, description, ricefw_type, status, priority, assignee, reporter, business_requirement, technical_specification, estimated_hours, created_at, updated_at, created_by, updated_by)
VALUES 
    ('Monthly Sales Report Enhancement', 'Enhance the monthly sales report to include regional breakdown and trend analysis', 'REPORT', 'IN_DEVELOPMENT', 'HIGH', 'john.doe@company.com', 'jane.smith@company.com', 'Business requires detailed regional sales analysis for better decision making', 'Modify existing report query to include region grouping and calculate month-over-month trends', 40.0, NOW(), NOW(), 'system', 'system'),
    ('Customer Data Migration Interface', 'Create interface to migrate customer data from legacy system', 'INTERFACE', 'DRAFT', 'CRITICAL', 'alice.johnson@company.com', 'bob.wilson@company.com', 'Need to migrate 50,000+ customer records from old CRM to new system', 'Build ETL process using Spring Batch with validation and error handling', 80.0, NOW(), NOW(), 'system', 'system'),
    ('Invoice Processing Workflow', 'Automated workflow for invoice approval process', 'WORKFLOW', 'TESTING', 'MEDIUM', 'charlie.brown@company.com', 'diana.prince@company.com', 'Automate invoice approval to reduce processing time from 5 days to 1 day', 'Implement multi-stage approval workflow with email notifications', 60.0, NOW(), NOW(), 'system', 'system');

-- Insert sample labels for tickets
INSERT INTO ricefw_labels (ricefw_id, label)
VALUES 
    (1, 'finance'),
    (1, 'reporting'),
    (1, 'enhancement'),
    (2, 'migration'),
    (2, 'data'),
    (2, 'legacy'),
    (3, 'automation'),
    (3, 'workflow'),
    (3, 'approval');

-- Insert sample components for tickets
INSERT INTO ricefw_components (ricefw_id, component)
VALUES 
    (1, 'Sales Module'),
    (1, 'Reporting Engine'),
    (2, 'Customer Management'),
    (2, 'Data Migration'),
    (3, 'Invoice Processing'),
    (3, 'Workflow Engine');

-- Insert sample comments
INSERT INTO ricefw_comments (content, author, ricefw_ticket_id, created_at, updated_at, created_by, updated_by)
VALUES 
    ('Started working on the database schema changes', 'john.doe@company.com', 1, NOW(), NOW(), 'system', 'system'),
    ('Need clarification on the regional breakdown requirements', 'john.doe@company.com', 1, NOW(), NOW(), 'system', 'system'),
    ('Data mapping document is ready for review', 'alice.johnson@company.com', 2, NOW(), NOW(), 'system', 'system'),
    ('Testing completed successfully, ready for UAT', 'charlie.brown@company.com', 3, NOW(), NOW(), 'system', 'system');
