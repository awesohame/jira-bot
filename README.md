# JIRA Bot

## Start Methods

### Method 1: Docker (Recommended for new environments)
```bash
# PowerShell (Windows)
docker-compose down; docker volume prune -f; docker-compose up --build

# Linux/macOS
docker-compose down && docker volume prune -f && docker-compose up --build
```

### Method 2: Maven with Development Database (H2 - in-memory)
```bash
cd server
mvn spring-boot:run
```
*Note: Uses H2 database by default - no PostgreSQL setup required*

### Method 3: Maven with Local PostgreSQL Setup
```bash
# First, set up PostgreSQL locally:
# 1. Install PostgreSQL
# 2. Create database: CREATE DATABASE jirabot;
# 3. Create user: CREATE USER jirabot WITH PASSWORD 'password';
# 4. Grant permissions: GRANT ALL PRIVILEGES ON DATABASE jirabot TO jirabot;

cd server
mvn spring-boot:run -Dspring.profiles.active=local
```

### Method 4: Database Only + Manual Backend
```bash
# Start only database
docker-compose up postgres pgadmin -d

# Backend with Docker profile
cd server
mvn spring-boot:run -Dspring.profiles.active=docker
```

## Troubleshooting

### PostgreSQL Authentication Error
If you get "password authentication failed" when using `mvn spring-boot:run`:
- **Solution 1**: Use Method 1 (Docker) - sets up database automatically
- **Solution 2**: Use Method 2 (H2) - no PostgreSQL needed  
- **Solution 3**: Set up local PostgreSQL using Method 3 instructions

## Access
- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api
- Database (pgAdmin): http://localhost:5050 (admin@admin.com / admin)  
- pgAdmin: http://localhost:8081 (admin@jirabot.com / admin)
