# passKind - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Development Guide](#development-guide)
5. [API Documentation](#api-documentation)
6. [Security Features](#security-features)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Topics](#advanced-topics)

---

## Overview

passKind is a secure secret management application built with:

- **Backend**: Spring Boot 3.2.3, PostgreSQL, JWT Authentication, AES-256 Encryption
- **Frontend**: React 18, Vite, Zustand, TanStack Query, Tailwind CSS
- **Infrastructure**: Docker Compose for containerization

### Key Features

- 🔐 **Secure Storage**: AES-256-GCM encryption for all secrets
- 🔑 **JWT Authentication**: Token-based authentication with HS512
- 👥 **User Management**: Registration, login, preferences
- 📝 **Audit Logging**: Track all secret access and modifications
- 🎨 **Modern UI**: Dark/light themes, responsive design
- 🔄 **Hot Reload**: Automatic code reloading during development
- 📊 **API Documentation**: Interactive Swagger UI

---

## Architecture

### System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React UI      │─────▶│  Spring Boot    │─────▶│   PostgreSQL    │
│   (Port 3000)   │      │   (Port 8080)   │      │   (Port 5432)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
    Vite Dev Server         Swagger UI
                           (Port 8080)
```

### Package Structure

#### Backend (`com.passkind.backend`)

```
com.passkind.backend/
├── config/              # Security, OpenAPI configuration
│   ├── SecurityConfig.java
│   └── OpenApiConfig.java
├── controller/          # REST API endpoints
│   ├── AuthController.java
│   ├── SecretController.java
│   └── UserController.java
├── dto/                 # Data Transfer Objects
│   └── ErrorResponse.java
├── entity/              # JPA entities
│   ├── User.java
│   ├── Secret.java
│   ├── AuditLog.java
│   └── SecretShare.java
├── exception/           # Custom exceptions
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   ├── BadRequestException.java
│   └── GlobalExceptionHandler.java
├── repository/          # Data access layer
│   ├── UserRepository.java
│   ├── SecretRepository.java
│   ├── AuditLogRepository.java
│   └── SecretShareRepository.java
├── security/            # JWT & authentication
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── service/             # Business logic
│   ├── SecretService.java
│   └── EncryptionService.java
└── PassKindBackendApplication.java
```

#### Frontend (`passkind-frontend/src`)

```
src/
├── components/          # Reusable UI components
│   ├── Login.jsx
│   ├── SecretModal.jsx
│   ├── ImportExport.jsx
│   └── Sidebar.jsx
├── pages/               # Page components
│   └── Dashboard.jsx
├── store/               # Zustand state management
│   └── useAuthStore.js
├── utils/               # Utilities
│   └── constants.js
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    preferences JSONB
);

-- Secrets table
CREATE TABLE secrets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    encrypted_value TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    action VARCHAR(50),
    resource_type VARCHAR(50),
    resource_id BIGINT,
    details TEXT,
    timestamp TIMESTAMP
);

-- Secret shares table
CREATE TABLE secret_shares (
    id BIGSERIAL PRIMARY KEY,
    secret_id BIGINT REFERENCES secrets(id),
    shared_with_id BIGINT REFERENCES users(id),
    permission VARCHAR(50)
);
```

---

## Getting Started

### Prerequisites

- Docker Desktop installed and running
- No local Java, Node.js, or PostgreSQL required

### Quick Start

1. **Clone/Navigate to project:**

   ```bash
   cd /Users/kgaviprasad/Downloads/PERS/pass
   ```

2. **Start all services:**

   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Adminer (DB): http://localhost:8081

### First-Time Setup

1. **Register a user via Swagger:**

   - Go to http://localhost:8080/swagger-ui.html
   - Find `POST /auth/register`
   - Click "Try it out"
   - Enter:
     ```json
     {
       "username": "admin",
       "password": "password123"
     }
     ```
   - Click "Execute"

2. **Login to get JWT token:**

   - Find `POST /auth/login`
   - Use same credentials
   - Copy the `accessToken` from response

3. **Authorize in Swagger:**

   - Click "Authorize" button (🔓 lock icon)
   - Paste token (without "Bearer ")
   - Click "Authorize" then "Close"

4. **Create your first secret:**
   - Find `POST /api/secrets`
   - Click "Try it out"
   - Enter:
     ```json
     {
       "title": "Gmail Password",
       "value": "mySecretPassword123",
       "metadata": { "email": "user@gmail.com" },
       "tags": ["email", "personal"]
     }
     ```

---

## Development Guide

### Hot Reload Setup

#### Frontend (Already Working)

- Changes to `.jsx`, `.js`, `.css` files reload instantly
- Powered by Vite HMR (Hot Module Replacement)

#### Backend (Configured)

- Java file changes trigger automatic restart (3-5 seconds)
- Powered by Spring Boot DevTools
- Volume mounts sync local files to container

### Development Workflow

1. **Start development environment:**

   ```bash
   docker-compose up
   ```

2. **Make code changes:**

   - Frontend: Edit files in `passkind-frontend/src/`
   - Backend: Edit files in `passkind-backend/src/main/java/`

3. **See changes automatically:**
   - Frontend: Instant
   - Backend: 3-5 seconds

### When to Rebuild

| Change Type                 | Command                                                |
| --------------------------- | ------------------------------------------------------ |
| Code files                  | No rebuild needed (hot reload)                         |
| `pom.xml` dependencies      | `docker-compose up --build`                            |
| Package structure           | `docker-compose build --no-cache && docker-compose up` |
| Dockerfile                  | `docker-compose up --build`                            |
| `package.json` dependencies | `docker-compose up --build`                            |

### Useful Commands

```bash
# View logs
docker logs passkind-backend -f
docker logs passkind-frontend -f

# Restart a service
docker-compose restart backend
docker-compose restart frontend

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Access database
docker exec -it postgres-db psql -U user -d appdb
```

---

## API Documentation

### Authentication Endpoints

#### POST /auth/register

Register a new user.

**Request:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "message": "User registered successfully"
}
```

#### POST /auth/login

Login and receive JWT token.

**Request:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer"
}
```

### Secret Management Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### GET /api/secrets

List all secrets for authenticated user.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Gmail Password",
    "metadata": { "email": "user@gmail.com" },
    "tags": ["email", "personal"],
    "createdAt": "2025-11-22T20:00:00Z",
    "updatedAt": "2025-11-22T20:00:00Z"
  }
]
```

#### POST /api/secrets

Create a new secret.

**Request:**

```json
{
  "title": "string",
  "value": "string",
  "metadata": { "key": "value" },
  "tags": ["tag1", "tag2"]
}
```

**Response:** `200 OK` - Returns created secret (value is encrypted)

#### GET /api/secrets/{id}/value

Get decrypted value of a secret.

**Response:** `200 OK`

```json
{
  "value": "decrypted_secret_value"
}
```

### User Endpoints

#### PUT /api/users/preferences

Update user preferences (theme, etc.).

**Request:**

```json
{
  "theme": "dark",
  "colorScheme": "blue"
}
```

#### GET /api/users/export

Export all secrets as CSV.

**Response:** CSV file download

---

## Security Features

### Encryption

**Algorithm:** AES-256-GCM

- **Key Size:** 256 bits (32 bytes)
- **Mode:** Galois/Counter Mode (authenticated encryption)
- **Key Storage:** Environment variable `ENCRYPTION_KEY`

**Implementation:**

```java
// Encryption
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec);
byte[] encrypted = cipher.doFinal(plaintext.getBytes());

// Decryption
cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec);
byte[] decrypted = cipher.doFinal(encrypted);
```

### JWT Authentication

**Algorithm:** HS512 (HMAC with SHA-512)

- **Token Expiration:** 1 hour (3600000ms)
- **Secret Key:** 64+ characters (environment variable)
- **Header:** `Authorization: Bearer <token>`

**Token Structure:**

```
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNjk...
│                     │                                    │
Header (Algorithm)    Payload (Claims)                    Signature
```

### Security Best Practices

1. **Passwords:** Hashed with BCrypt (strength 10)
2. **CORS:** Configured for localhost:3000 and localhost:8080
3. **CSRF:** Disabled (stateless JWT authentication)
4. **Session:** Stateless (no server-side sessions)
5. **HTTPS:** Recommended for production
6. **Secrets:** Never logged or exposed in responses

### Environment Variables

```yaml
# Required for production
ENCRYPTION_KEY=<32-character-string>
JWT_SECRET=<64-character-string>

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/appdb
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=pass
```

---

## Troubleshooting

### Common Issues

#### 1. 403 Forbidden in Swagger

**Cause:** Invalid or expired JWT token

**Solution:**

1. Login via `POST /auth/login`
2. Copy the new `accessToken`
3. Click "Authorize" in Swagger
4. Paste token (without "Bearer ")
5. Try request again

#### 2. "Invalid AES key length" Error

**Cause:** `ENCRYPTION_KEY` is not exactly 32 bytes

**Solution:**

```bash
# Already fixed in docker-compose.yml
# If you see this error:
docker-compose down
docker-compose up -d
```

#### 3. Backend Not Starting

**Check logs:**

```bash
docker logs passkind-backend
```

**Common fixes:**

```bash
# Restart backend
docker-compose restart backend

# Full rebuild
docker-compose down
docker-compose up --build

# Clear cache and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### 4. Frontend Can't Connect to Backend

**Verify:**

1. Backend is running: `docker ps | grep passkind-backend`
2. Check `VITE_API_URL` in docker-compose.yml
3. Check CORS configuration in `SecurityConfig.java`

**Fix:**

```bash
docker-compose restart backend frontend
```

#### 5. Database Connection Failed

**Check:**

```bash
docker logs postgres-db
```

**Fix:**

```bash
docker-compose restart db
# Wait 5 seconds
docker-compose restart backend
```

#### 6. Port Already in Use

**Find what's using the port:**

```bash
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # PostgreSQL
```

**Solution:** Stop the conflicting process or change ports in `docker-compose.yml`

### Debug Mode

**Enable debug logging:**

Add to `application.yml`:

```yaml
logging:
  level:
    com.passkind.backend: DEBUG
    org.springframework.security: DEBUG
```

**View detailed logs:**

```bash
docker logs passkind-backend -f
```

---

## Advanced Topics

### Custom Error Handling

All API errors return consistent format:

```json
{
  "timestamp": "2025-11-22T20:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Secret not found with id: 123",
  "path": "/api/secrets/123/value"
}
```

**Custom Exceptions:**

- `ResourceNotFoundException` → 404
- `UnauthorizedException` → 401
- `BadRequestException` → 400

### Audit Logging

All secret operations are logged:

```java
AuditLog log = new AuditLog();
log.setUsername(username);
log.setAction("READ");
log.setResourceType("SECRET");
log.setResourceId(secretId);
log.setDetails("Accessed secret value");
auditLogRepository.save(log);
```

**Query audit logs:**

```sql
SELECT * FROM audit_logs
WHERE username = 'admin'
ORDER BY timestamp DESC;
```

### Database Backup

**Export data:**

```bash
docker exec postgres-db pg_dump -U user appdb > backup.sql
```

**Restore data:**

```bash
docker exec -i postgres-db psql -U user appdb < backup.sql
```

### Production Deployment

**Checklist:**

- [ ] Change `ENCRYPTION_KEY` to strong random value
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Update `SPRING_DATASOURCE_PASSWORD`
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set `SPRING_JPA_HIBERNATE_DDL_AUTO=validate`
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Performance Tuning

**Database Connection Pool:**

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
```

**JVM Options:**

```dockerfile
ENV JAVA_OPTS="-Xmx512m -Xms256m"
```

---

## Project Information

**Version:** 1.0.0  
**License:** Educational/Personal Use  
**Author:** passKind Team  
**Last Updated:** November 2025

**Tech Stack:**

- Spring Boot 3.2.3
- React 18
- PostgreSQL 15
- Docker & Docker Compose
- JWT (JJWT 0.11.5)
- Vite 5.4
- Tailwind CSS 3.4

**Repository Structure:**

```
pass/
├── passkind-backend/       # Spring Boot application
├── passkind-frontend/      # React application
├── docker-compose.yml      # Container orchestration
├── README.md               # Quick start guide
└── DOCUMENTATION.md        # This file
```

---

## Support & Resources

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Database Admin:** http://localhost:8081
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **React Docs:** https://react.dev
- **Docker Docs:** https://docs.docker.com

---

**End of Documentation**
