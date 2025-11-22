# passKind - Secure Secret Management Application

A full-stack secret management application with Spring Boot (Backend), React (Frontend), and PostgreSQL (Database), fully containerized with Docker.

## Features

- **Backend**: Spring Boot 3, JWT Authentication, AES-256 Encryption, RBAC, Audit Logging, Swagger UI
- **Frontend**: React (Vite), Zustand, TanStack Query, Tailwind CSS, Dark/Light Themes
- **Database**: PostgreSQL 15 with persistent volumes
- **Infrastructure**: Docker Compose, Hot-reloading support

## Prerequisites

- **Docker Desktop** (running)
- No local Java, Node.js, or Maven installation required

## Quick Start

1. **Clone/Open the project**:

   ```bash
   cd /Users/kgaviprasad/Downloads/PERS/pass
   ```

2. **Run the application**:

   ```bash
   docker-compose up -d
   ```

   _Note: The first run may take a few minutes to download dependencies._

3. **Access the Services**:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API (Swagger)**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - **Database Manager (Adminer)**: [http://localhost:8081](http://localhost:8081)

## Using Swagger UI for API Testing

### Step 1: Register a User

1. Open **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
2. Find **POST /auth/register**
3. Click **"Try it out"**
4. Enter credentials:
   ```json
   {
     "username": "testuser",
     "password": "testpass"
   }
   ```
5. Click **"Execute"**
6. Should return **200 OK**

### Step 2: Login to Get JWT Token

1. Find **POST /auth/login**
2. Click **"Try it out"**
3. Enter the same credentials
4. Click **"Execute"**
5. **Copy the `accessToken`** from the response (long string starting with `eyJ...`)

### Step 3: Authorize in Swagger

1. Click the **"Authorize"** button (🔓 lock icon) at the top right of the page
2. In the popup dialog, paste **ONLY the token** (without "Bearer ")
3. Click **"Authorize"**
4. Click **"Close"**
5. The lock icon should now appear closed (🔒)

**Important Notes:**

- ✅ Refreshing the Swagger page **preserves** your authorization
- ❌ After backend restarts, you **must get a new token** and re-authorize
- ⏱️ Tokens expire after 1 hour

### Step 4: Create a Secret

1. Find **POST /api/secrets**
2. Click **"Try it out"**
3. Enter:
   ```json
   {
     "title": "Gmail Password",
     "value": "superSecretPass123!",
     "metadata": {
       "email": "user@gmail.com",
       "category": "email"
     },
     "tags": ["email", "personal"]
   }
   ```
4. Click **"Execute"**
5. Should return **200 OK** with the created secret (value is encrypted in DB)

### Step 5: List Your Secrets

1. Find **GET /api/secrets**
2. Click **"Try it out"**
3. Click **"Execute"**
4. Returns an array of your secrets (encrypted values are not shown)

### Step 6: Get Decrypted Secret Value

1. Find **GET /api/secrets/{id}/value**
2. Enter the secret ID from the previous step
3. Click **"Execute"**
4. Returns the decrypted value

## Using the Frontend UI

1. Go to [http://localhost:3000](http://localhost:3000)
2. Login with your credentials
3. **Dashboard Features**:
   - Search and filter secrets
   - Create new secrets with password generator
   - View and copy secret values
   - Toggle dark/light mode and color schemes

## Database Management (Adminer)

1. Go to [http://localhost:8081](http://localhost:8081)
2. Login with:
   - **System**: PostgreSQL
   - **Server**: db
   - **Username**: user
   - **Password**: pass
   - **Database**: appdb
3. Browse tables: `users`, `secrets`, `audit_logs`, `secret_shares`

## Troubleshooting

### Issue: 403 Forbidden in Swagger

**Cause**: Using an old/invalid JWT token

**Solution**:

1. Get a fresh token via **POST /auth/login**
2. Copy the new `accessToken`
3. Click **"Authorize"** and paste the token
4. Try the request again

### Issue: "Invalid AES key length" Error

**Cause**: `ENCRYPTION_KEY` environment variable is not exactly 32 bytes

**Solution**: Already fixed in `docker-compose.yml`. If you see this error:

```bash
docker-compose down
docker-compose up -d
```

### Issue: Backend Not Starting

**Check logs**:

```bash
docker logs passkind-backend
```

**Common fixes**:

```bash
# Restart backend
docker-compose restart backend

# Full rebuild
docker-compose down
docker-compose up --build
```

### Issue: Database Data Lost

**Cause**: Docker volume was deleted

**Solution**:

- Data persists in named volume `postgres_data`
- To reset: `docker-compose down -v` (⚠️ deletes all data)
- To keep data: `docker-compose down` (without `-v`)

### Issue: Port Already in Use

**Solution**:

```bash
# Check what's using the port
lsof -i :8080  # or :3000, :5432, :8081

# Stop conflicting services or change ports in docker-compose.yml
```

## Architecture

### Security Features

- **Encryption**: AES-256-GCM for secret values
- **Authentication**: JWT with HS512 algorithm
- **Authorization**: Role-based access control (RBAC)
- **Audit**: All actions logged to `audit_logs` table

### Key Environment Variables

- `JWT_SECRET`: 64+ characters for HS512 (already configured)
- `ENCRYPTION_KEY`: Exactly 32 bytes for AES-256 (already configured)
- `VITE_API_URL`: Backend URL for frontend

## API Endpoints

### Public

- `POST /auth/register` - Register new user
- `POST /auth/login` - Get JWT token

### Protected (Requires JWT)

- `GET /api/secrets` - List user's secrets
- `POST /api/secrets` - Create new secret
- `GET /api/secrets/{id}/value` - Get decrypted value
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/export` - Export secrets as CSV

## Development

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker logs passkind-backend -f
docker logs passkind-frontend -f
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

## Project Structure

```
pass/
├── passkind-backend/       # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── passkind-frontend/      # React UI
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Orchestration
└── README.md
```

## License

This project is for educational/personal use.

5.  Click **Execute**.

### 2. Login via Frontend

1.  Open the **React App**: [http://localhost:3000](http://localhost:3000)
2.  Enter the credentials you just created (`admin` / `password`).
3.  Click **ENTER**.
4.  You will be redirected to the **Dashboard**.

### 3. View Database Data

1.  Open **Adminer**: [http://localhost:8081](http://localhost:8081)
2.  **System**: PostgreSQL
3.  **Server**: `db` (This is the container name)
4.  **Username**: `user`
5.  **Password**: `pass`
6.  **Database**: `appdb`
7.  Click **Login**.
8.  Click **select** next to the `users` table to see the data.

## Project Structure

- `spring-boot-jwt-app/`: Backend source code.
- `react-app/`: Frontend source code.
- `docker-compose.yml`: Orchestration for all services.

## Troubleshooting

### Windows Users

- **Volume Mounting**: If you see errors about "mounting" or "file not found", ensure:
  - You are using **WSL 2** backend in Docker Desktop (recommended).
  - If using Hyper-V, verify that your drive (C:) is checked in **Docker Desktop > Settings > Resources > File Sharing**.
- **Line Endings (CRLF)**: If you encounter weird errors like `\r: command not found` in logs, it might be due to Windows line endings. Ensure your git client is configured with `git config --global core.autocrlf input` or use a tool like `dos2unix`.
- **Ports**: If ports `3000`, `8080`, or `5432` are already in use:
  - Stop the other services.
  - Or change the host port in `docker-compose.yml` (e.g., `"3001:5173"`).
- **Firewall**: If you cannot access `localhost:3000`, check if Windows Firewall is blocking the connection.

### General

- **Container Conflicts**: If you see "container name already in use", run:
  ```bash
  docker-compose down
  docker-compose up --build
  ```
- **Database Connection**: If the backend fails to connect to the DB on startup, it might be a timing issue. The `depends_on` flag usually handles this, but a restart (`docker-compose restart backend`) often fixes it.
