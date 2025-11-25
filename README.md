# PassKind 🔐

> **Your Digital Life, Secured.**  
> Open source, self-hosted password manager with zero-knowledge encryption.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](docker-compose.yml)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

---

## 🚀 Overview

**PassKind** is a modern, self-hosted password manager designed for privacy-conscious individuals and teams. Built with a "security-first" architecture, it ensures your data remains yours—encrypted, local, and accessible only by you.

Stop trusting third-party clouds with your most sensitive data. Take control with PassKind.

### ✨ Key Features

- **🛡️ Zero-Knowledge Encryption**: AES-256-GCM encryption before database storage
- **🎨 Modern UI**: Beautiful React interface with dark/light mode support
- **⚡ Lightning Fast**: Spring Boot 3 + Vite for instant load times
- **🐳 Docker Ready**: Deploy anywhere with `docker-compose up`
- **🔍 Audit Logging**: Track every access and modification
- **📱 Responsive Design**: Works seamlessly on all devices
- **🔑 Password Management**: Forgot password, change password flows
- **📧 Email Verification**: OTP-based email verification with beautiful templates
- **🔒 Auto-Lock**: Configurable inactivity timeout for enhanced security
- **💾 Vault Export**: Export your secrets as JSON or password-protected Excel

---


## 🛠️ Quick Start

### Prerequisites

- **Docker Desktop** (required)
- **Git** (required)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gaviprasad/passkind.git
   cd passkind
   ```

2. **Create environment file**

   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**

   Edit `.env` and set the following **required** variables:

   ```env
   # Database
   POSTGRES_DB=passkind
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_secure_password

   # JWT Secret (at least 32 characters)
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here

   # Encryption Key (exactly 32 characters)
   ENCRYPTION_KEY=your32characterencryptionkey12

   # Email Configuration (for OTP)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password

   # Frontend API URL
   VITE_API_URL=http://localhost:8080
   ```

   > **Note**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

4. **Start the application**

   ```bash
   docker-compose up -d
   ```

5. **Access your vault**
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
   - **Database Admin** (Adminer): [http://localhost:8081](http://localhost:8081)

> **Note**: The first launch may take a few minutes to download dependencies and build images.

---

## 📋 Environment Variables

### Required Variables

| Variable            | Description                       | Example                                 |
| ------------------- | --------------------------------- | --------------------------------------- |
| `POSTGRES_DB`       | Database name                     | `passkind`                              |
| `POSTGRES_USER`     | Database user                     | `passkind_user`                         |
| `POSTGRES_PASSWORD` | Database password                 | `secure_password_123`                   |
| `JWT_SECRET`        | Secret for JWT tokens (32+ chars) | `your_jwt_secret_key_min_32_characters` |
| `ENCRYPTION_KEY`    | Encryption key (exactly 32 chars) | `12345678901234567890123456789012`      |
| `MAIL_HOST`         | SMTP server host                  | `smtp.gmail.com`                        |
| `MAIL_PORT`         | SMTP server port                  | `587`                                   |
| `MAIL_USERNAME`     | Email address for sending         | `your@email.com`                        |
| `MAIL_PASSWORD`     | Email password/app password       | `your_app_password`                     |
| `VITE_API_URL`      | Frontend API base URL             | `http://localhost:8080`                 |

### Optional Variables

| Variable                        | Description          | Default                 |
| ------------------------------- | -------------------- | ----------------------- |
| `SPRING_PROFILES_ACTIVE`        | Spring Boot profile  | `dev`                   |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode   | `update`                |
| `CORS_ALLOWED_ORIGINS`          | Allowed CORS origins | `http://localhost:5173` |

---

## 🏗️ Architecture

### Technology Stack

**Backend:**

- Spring Boot 3.2
- Spring Security with JWT
- PostgreSQL 15
- AES-256-GCM Encryption
- JavaMailSender for OTP emails

**Frontend:**

- React 18
- TanStack Query (React Query)
- React Router v6
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)

**Infrastructure:**

- Docker & Docker Compose
- PostgreSQL
- Adminer (DB management)

---

## 🔐 Security Features

### Encryption

- **Algorithm**: AES-256-GCM
- **Key Management**: Environment-based (never stored in database)
- **Scope**: All secret values encrypted before database insertion

### Authentication & Authorization

- **JWT-based**: Stateless authentication
- **Account Locking**: Auto-lock after 5 failed login attempts (1-hour duration)
- **Email Verification**: OTP-based email verification
- **Password Reset**: Secure OTP-based password reset flow
- **Auto-Lock Timer**: Configurable inactivity timeout (1-60 minutes)

### Audit Logging

Every secret modification is logged with:

- Action type (CREATE, UPDATE, DELETE)
- Timestamp
- User who performed the action
- Previous data snapshot

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint                    | Description             | Auth Required |
| ------ | --------------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register`        | Register new user       | No            |
| POST   | `/api/auth/login`           | Login                   | No            |
| POST   | `/api/auth/verify-email`    | Verify email with OTP   | No            |
| POST   | `/api/auth/resend-otp`      | Resend verification OTP | No            |
| POST   | `/api/auth/forgot-password` | Initiate password reset | No            |
| POST   | `/api/auth/reset-password`  | Reset password with OTP | No            |

### Users

| Method | Endpoint                     | Description         | Auth Required |
| ------ | ---------------------------- | ------------------- | ------------- |
| GET    | `/api/users/me`              | Get current user    | Yes           |
| PUT    | `/api/users/me`              | Update user profile | Yes           |
| POST   | `/api/users/change-password` | Change password     | Yes           |

### Secrets

| Method | Endpoint                    | Description            | Auth Required |
| ------ | --------------------------- | ---------------------- | ------------- |
| GET    | `/api/secrets`              | List user's secrets    | Yes           |
| POST   | `/api/secrets`              | Create secret          | Yes           |
| GET    | `/api/secrets/{id}`         | Get secret details     | Yes           |
| GET    | `/api/secrets/{id}/value`   | Get decrypted value    | Yes           |
| PUT    | `/api/secrets/{id}`         | Update secret          | Yes           |
| DELETE | `/api/secrets/{id}`         | Delete secret          | Yes           |
| GET    | `/api/secrets/{id}/history` | Get secret audit trail | Yes           |
| GET    | `/api/secrets/export`       | Export vault as JSON   | Yes           |
| POST   | `/api/secrets/export/excel` | Export vault as Excel  | Yes           |

---

## 🧪 Development

### Running Locally (Without Docker)

#### Backend

```bash
cd passkind-backend
./mvnw spring-boot:run
```

#### Frontend

```bash
cd passkind-frontend
npm install
npm run dev
```

### Building for Production

#### Backend

```bash
cd passkind-backend
./mvnw clean package
```

#### Frontend

```bash
cd passkind-frontend
npm run build
```

---

## 🎨 Features Walkthrough

### 1. **User Registration & Email Verification**

- Register with username, email, password, phone number
- Receive OTP via beautiful branded email template
- Verify email to activate account

### 2. **Password Management**

- **Forgot Password**: Email-based OTP reset flow
- **Change Password**: Secure password change from profile

### 3. **Vault Management**

- Create, read, update, delete secrets
- Store credentials with metadata (tags, notes, URLs)
- View decrypted values on demand

### 4. **Audit Trail**

- Track all changes to secrets
- View who made changes and when
- See previous values in timeline

### 5. **Export Options**

- **JSON Export**: Unencrypted JSON with all secrets
- **Excel Export**: Password-protected Excel file

### 6. **Auto-Lock**

- Configurable inactivity timeout
- Auto-logout for enhanced security

---

## 🐛 Troubleshooting

### Email OTP Not Sending

1. Verify `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` in `.env`
2. For Gmail, ensure you're using an [App Password](https://support.google.com/accounts/answer/185833)
3. Check Docker logs: `docker logs passkind-backend`

### Frontend Can't Connect to Backend

1. Verify `VITE_API_URL` in `.env`
2. Ensure backend is running: `docker ps`
3. Check network connectivity: `curl http://localhost:8080/api/auth/login`

### Database Connection Issues

1. Verify PostgreSQL is running: `docker ps | grep postgres`
2. Check database credentials in `.env`
3. Restart containers: `docker-compose restart`

---

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gaviprasad">Gavi Prasad</a>
</p>
