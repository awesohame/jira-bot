docker-compose up postgres pgadmin -d
cd server
mvn spring-boot:run


Backend runs on: `http://localhost:8080/api`

cd client
npm install
npm run dev

Frontend runs on: `http://localhost:5173`

## Access Points

- **Frontend**: http://localhost:5173
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
