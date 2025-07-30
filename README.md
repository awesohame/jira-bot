## JIRA Bot - Full Stack Application

### Quick Start

```bash
# Start PostgreSQL and pgAdmin
docker-compose up postgres pgadmin -d

# Start Backend (in server directory)
cd server
mvn spring-boot:run

# Start Frontend (in client directory)  
cd client
npm install
npm run dev
```

### Access Points

- **Frontend**: http://localhost:5173 or http://localhost:5174
- **Backend API**: http://localhost:8080/api
- **pgAdmin**: http://localhost:8081
  - Email: `admin@jirabot.com`
  - Password: `admin`
- **H2 Console**: http://localhost:8080/api/h2-console
  - JDBC URL: `jdbc:h2:mem:jirabot_dev`
  - Username: `sa`
  - Password: (empty)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account (username, email, password, token)
- `POST /api/auth/login` - Login (username, password)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/validate` - Validate token
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects/search` - Search JIRA projects (requires authentication)
  - Body: `{ "atlassianDomain": "your-domain", "searchQuery": "optional" }`
  - Uses stored user email and JIRA token automatically
  - Calls Atlassian JIRA API as proxy

### Test Endpoints
- `GET /api/test/health` - Health check
- `GET /api/test/info` - Application info

## Database Connection (pgAdmin)

1. Open pgAdmin: http://localhost:8081
2. Login with credentials above
3. Register Server:
   - Name: `JiraBot PostgreSQL`
   - Host: `jirabot-postgres`
   - Port: `5432`
   - Database: `jirabot`
   - Username: `jirabot`
   - Password: `password`

## Development

### Backend Development
```bash
cd server
mvn spring-boot:run
```

### Frontend Development
```bash
cd client
npm run dev
```

### View Database Tables
- **pgAdmin**: Navigate to Tables section after connecting
- **H2 Console**: Run `SELECT * FROM users;` to view user data

## Features

✅ User Authentication (Signup/Login)  
✅ JWT-like Token Management  
✅ Password Encryption (BCrypt)  
✅ TypeScript Frontend  
✅ Tailwind CSS Styling  
✅ PostgreSQL Integration  
✅ Docker Support  
✅ Responsive Design  
✅ JIRA Projects Integration  
✅ JIRA API Proxy (calls Atlassian API)  
✅ Project Search & Display  
✅ Token-based JIRA Authentication

## JIRA Integration

The application now includes JIRA project management functionality:

### Projects Page
- Navigate to `/projects` after logging in
- Enter your Atlassian domain (e.g., `your-company` for `your-company.atlassian.net`)
- Search projects by name or key (optional)
- View projects in responsive card layout
- Click to open projects in JIRA
- Copy project keys to clipboard

### How it works
1. User provides their JIRA API token during signup
2. Backend stores the token securely in PostgreSQL
3. When searching projects, backend calls Atlassian API using:
   - User's email as username
   - Stored JIRA token as password
   - Basic Auth to `https://{domain}.atlassian.net/rest/api/3/project/search`
4. Results are displayed in a beautiful card-based UI

### JIRA API Token Setup
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Create an API token
3. Use this token during signup in the application
