# JIRA RICEFW Server

Backend service for managing JIRA RICEFW (Reports, Interfaces, Conversions, Enhancements, Forms, Workflows) updates.

## Tech Stack
- **Java 17**
- **Spring Boot 3.2.0**
- **Maven**
- **H2 Database** (development)
- **PostgreSQL** (production)

## Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. Navigate to the server directory:
```bash
cd server
```

2. Run the application:
```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

### Available Endpoints

#### Test Endpoints
- `GET /api/test/health` - Health check
- `GET /api/test/info` - Application information
- `POST /api/test/echo` - Echo test for JSON payload
- `GET /api/test/jira-test` - JIRA integration test (placeholder)

#### Development Tools
- `GET /api/h2-console` - H2 Database console (username: `sa`, password: empty)
- `GET /api/actuator/health` - Spring Boot health endpoint

### Example API Calls

**Health Check:**
```bash
curl http://localhost:8080/api/test/health
```

**Echo Test:**
```bash
curl -X POST http://localhost:8080/api/test/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from client!"}'
```

### Configuration

Key configuration in `application.properties`:
- Server runs on port 8080
- H2 in-memory database for development
- CORS enabled for frontend origins
- Security temporarily disabled for test endpoints

### Next Steps

1. **JIRA Integration** - Add JIRA API client and authentication
2. **Database Schema** - Design tables for RICEFW data
3. **Docker Setup** - Add Dockerfile and docker-compose
4. **PostgreSQL Integration** - Switch to PostgreSQL for production

## Development Notes

- Security is currently minimal (disabled for test endpoints)
- Using H2 database for easy development setup
- CORS configured for React development servers
- Actuator enabled for monitoring and health checks
