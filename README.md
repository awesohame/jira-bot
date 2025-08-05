# JIRA Bot

A full-stack web application for managing JIRA issues with bulk creation capabilities.

## Prerequisites

- **Docker & Docker Compose**
- **Node.js 18+** (for frontend)

## JIRA Setup

1. **Create Atlassian Account**: Sign up at https://id.atlassian.com/signup
2. **Get API Token**: Visit https://developer.atlassian.com/console/myapps/ to create an API token
3. **Important**: The email used for the application account must match your Atlassian account email

## Quick Start

```bash
# Start backend and database
docker-compose down; docker volume prune -f; docker-compose up --build

# Start frontend (separate terminal)
cd client
npm install
npm run dev
```

## Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **pgAdmin**: http://localhost:8081 (admin@jirabot.com / admin)

## Features

- User registration and login
- View and manage JIRA projects
- Create, view, and update JIRA issues
- **Bulk Issue Creation**: Upload Excel files to create multiple issues
- RICEFW categorization (Report, Interface, Conversion, Enhancement, Form, Workflow)
- Filter issues by status, priority, assignee, type, and category

## Bulk Issue Creation Format

Excel file columns:
- **A**: Summary (required)
- **B**: Description (optional)  
- **C**: Issue Type (Task, Bug, Story, etc.)
- **D**: Priority (Highest, High, Medium, Low, Lowest)
- **E**: Labels (comma-separated, optional)

## Troubleshooting

- **Port conflicts**: Modify docker-compose.yml if ports 5173, 8080, 5432, or 8081 are in use
- **JIRA API errors**: Verify your Atlassian email matches the application account email and API token is correct
- **Build errors**: Run `npm install` in client directory
