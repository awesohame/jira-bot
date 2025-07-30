-- Update existing users to have a sample JIRA token
-- This is a one-time migration script for existing users

UPDATE users 
SET jira_token = 'sample-jira-token-' || username || '-' || id
WHERE jira_token IS NULL;

-- Check the results
SELECT id, username, email, 
       CASE 
           WHEN jira_token IS NOT NULL THEN SUBSTRING(jira_token, 1, 20) || '...'
           ELSE 'NULL'
       END as jira_token_preview
FROM users;
