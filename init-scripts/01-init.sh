#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extensions if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Create schema for application
    CREATE SCHEMA IF NOT EXISTS jirabot;
    
    -- Grant permissions
    GRANT ALL PRIVILEGES ON SCHEMA jirabot TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA jirabot TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA jirabot TO $POSTGRES_USER;
    
    -- Set default schema
    ALTER USER $POSTGRES_USER SET search_path = jirabot, public;
EOSQL
