# Acquisitions API

##  Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Docker](#docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Database Management](#database-management)
- [Security](#security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

The Acquisitions API is a robust Node.js backend service built with Express.js, featuring user authentication, PostgreSQL database integration via Drizzle ORM, comprehensive security measures, and full Docker containerization support. The project includes complete CI/CD workflows through GitHub Actions and is designed for production-ready deployment.

### Key Features
-  JWT-based authentication with secure cookie management
-  PostgreSQL database with Drizzle ORM for type-safe queries
-  Advanced security with Helmet, CORS, and Arcjet protection
-  Full Docker containerization for development and production
-  Neon serverless PostgreSQL integration
-  Automated CI/CD pipelines with GitHub Actions
-  Comprehensive logging with Winston
- Testing suite with Jest and Supertest

##  Architecture

```mermaid
graph TB
    Client[Client Applications] --> API[Express API Server]
    API --> Auth[Authentication Layer]
    API --> MW[Middleware Stack]
    MW --> Security[Security Middleware]
    MW --> Validation[Request Validation]
    API --> Routes[Route Handlers]
    Routes --> Controllers[Controllers]
    Controllers --> Services[Business Logic Services]
    Services --> DB[(PostgreSQL/Neon)]
    Services --> Cache[Caching Layer]
    
    subgraph "Infrastructure"
        Docker[Docker Container]
        GH[GitHub Actions]
        Monitor[Monitoring/Logging]
    end
```

##  Technology Stack

### Core Technologies
- **Runtime**: Node.js 20.x (ES Modules)
- **Framework**: Express.js 5.x
- **Language**: JavaScript (ES6+)
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM
- **Tests**: Jest & SuperTest

### Dependencies
- **Authentication**: 
  - `jsonwebtoken`: JWT token generation and validation
  - `bcrypt`: Password hashing and verification
  - `cookie-parser`: Secure cookie management

- **Security**:
  - `helmet`: Security headers
  - `cors`: Cross-Origin Resource Sharing
  - `@arcjet/node`: Advanced rate limiting and bot protection

- **Database**:
  - `drizzle-orm`: Type-safe ORM
  - `@neondatabase/serverless`: Neon PostgreSQL client
  - `pg`: PostgreSQL client library

- **Utilities**:
  - `dotenv`: Environment variable management
  - `winston`: Advanced logging
  - `morgan`: HTTP request logging
  - `zod`: Schema validation

### Development Dependencies
- **Testing**:
  - `jest`: Test framework
  - `supertest`: HTTP assertion library

- **Code Quality**:
  - `eslint`: Code linting
  - `prettier`: Code formatting
  - `eslint-config-prettier`: ESLint and Prettier integration

- **Database Tools**:
  - `drizzle-kit`: Database migration and generation tools

##  Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: Version 20.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Docker**: Version 24.x or higher
- **Docker Compose**: Version 2.x or higher
- **Git**: Version control system

### Optional Tools
- **WSL2** (Windows users): For better Docker performance
- **PostgreSQL Client**: For direct database access
- **Postman/Insomnia**: For API testing

### Account Requirements
- **GitHub Account**: For repository and GitHub Actions
- **Neon Account**: For serverless PostgreSQL (free tier available)
- **Docker Hub Account**: For container registry (optional)
- **Arcjet Account**: For advanced security features (optional)

##  Project Structure

```
acquisitions/
├── .github/
│   └── workflows/           # GitHub Actions CI/CD workflows
│       ├── docker-build-and-push.yml
│       ├── lint-and-format.yml
│       └── tests.yml
├── src/
│   ├── config/              # Configuration files
│   │   ├── arcjet.js        # Arcjet security configuration
│   │   ├── database.js      # Database connection setup
│   │   └── logger.js        # Winston logger configuration
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   └── users.controller.js
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.js
│   │   └── security.middleware.js
│   ├── models/              # Database models (Drizzle schemas)
│   │   └── user.model.js
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.js
│   │   └── users.routes.js
│   ├── services/            # Business logic layer
│   │   ├── auth.service.js
│   │   └── users.services.js
│   ├── utils/               # Utility functions
│   │   ├── cookies.js       # Cookie utilities
│   │   ├── format.js        # Data formatting
│   │   └── jwt.js           # JWT utilities
│   ├── validations/         # Request validation schemas
│   │   ├── auth.validations.js
│   │   └── users.validation.js
│   ├── app.js               # Express app configuration
│   ├── index.js             # Application entry point
│   └── server.js            # Server initialization
├── tests/
│   └── app.test.js          # Test suites
├── drizzle/                 # Database migrations
├── logs/                    # Application logs
├── scripts/                 # Utility scripts
│   ├── dev.sh              # Development startup script
│   └── prod.sh             # Production startup script
├── .env                     # Environment variables (git-ignored)
├── .env.development         # Development environment template
├── .env.production          # Production environment template
├── .dockerignore           # Docker ignore patterns
├── .gitignore              # Git ignore patterns
├── .prettierignore         # Prettier ignore patterns
├── .prettierrc             # Prettier configuration
├── docker-compose.dev.yml   # Development Docker configuration
├── docker-compose.prod.yml  # Production Docker configuration
├── Dockerfile              # Docker image definition
├── drizzle.config.js       # Drizzle ORM configuration
├── eslint.config.js        # ESLint configuration
├── jest.config.mjs         # Jest test configuration
├── package.json            # Node.js dependencies and scripts
└── README.md               # Project documentation (this file)
```

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shirocodes/acquisitions.git
cd acquisitions
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.development .env
```

Edit `.env` and configure your environment variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Database Configuration (Local Development)
DATABASE_URL=postgresql://username:password@localhost:5432/acquisitions_db

# Security Keys
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Arcjet Security (Optional)
ARCJET_ENV=development
ARCJET_API_KEY=your-arcjet-key
```

### 4. Database Setup

#### Option A: Using Neon Cloud (Recommended)
1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy your connection string to `DATABASE_URL` in `.env`

#### Option B: Using Local PostgreSQL
```bash
# Create database
createdb acquisitions_db

# Run migrations
npm run db:generate
npm run db:migrate
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

##  Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot-reload
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues automatically
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Database
npm run db:generate     # Generate database migrations
npm run db:migrate      # Apply database migrations
npm run db:studio       # Open Drizzle Studio (database GUI)

# Testing
npm test               # Run test suite with coverage

# Docker
npm run dev:docker     # Start development containers
npm run prod:docker    # Start production containers
```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure code quality:
   ```bash
   npm run lint:fix
   npm run format
   ```

3. **Write/update tests**:
   ```bash
   npm test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **ESLint**: Enforces code quality and consistency
- **Prettier**: Maintains uniform code formatting
- **Commit Convention**: Use conventional commits (feat:, fix:, docs:, etc.)

##  Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- app.test.js
```

### Test Structure

```javascript
// Example test in tests/app.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- HTML report: `coverage/lcov-report/index.html`
- JSON summary: `coverage/coverage-summary.json`

## Docker

### Docker Setup

The project includes comprehensive Docker configurations for both development and production environments.

### Development with Docker

```bash
# Start development environment with Neon Local
docker-compose -f docker-compose.dev.yml up

# Run in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop containers
docker-compose -f docker-compose.dev.yml down

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build
```

### Production with Docker

```bash
# Build production image
docker build -t acquisitions:prod .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Using environment file
docker run --env-file .env.production -p 3000:3000 acquisitions:prod
```

### Docker Commands Reference

```bash
# List running containers
docker ps

# View container logs
docker logs acquisitions-app-dev

# Access container shell
docker exec -it acquisitions-app-dev sh

# Clean up unused resources
docker system prune -a

# Remove all containers and volumes
docker-compose down -v
```

## CI/CD Pipeline

### GitHub Actions Workflows

The project includes three automated workflows:

#### 1. **Lint and Format** (`lint-and-format.yml`)
- **Triggers**: Push/PR to `main` and `staging` branches
- **Actions**:
  - Checks code with ESLint
  - Validates formatting with Prettier
  - Provides fix suggestions in annotations

#### 2. **Tests** (`tests.yml`)
- **Triggers**: Push/PR to `main` and `staging` branches
- **Actions**:
  - Runs complete test suite
  - Generates coverage reports
  - Uploads coverage artifacts
  - Creates test summary in PR

#### 3. **Docker Build and Push** (`docker-build-and-push.yml`)
- **Triggers**: Push to `main` or manual dispatch
- **Actions**:
  - Builds multi-platform Docker images
  - Tags with version, branch, and timestamp
  - Pushes to Docker Hub
  - Generates deployment summary

### Setting Up CI/CD

1. **Configure GitHub Secrets**:
   - Go to Settings → Secrets and variables → Actions
   - Add required secrets:
     ```
     DOCKER_USERNAME    # Docker Hub username
     DOCKER_PASSWORD    # Docker Hub password/token
     ```

2. **Enable GitHub Actions**:
   - Actions are automatically enabled when workflows are pushed
   - Monitor runs in the Actions tab

3. **Branch Protection** (Recommended):
   - Require PR reviews before merging
   - Require status checks to pass
   - Require branches to be up to date

## 📡 API Documentation

### Base URL
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

### Endpoints

#### Health Check
```http
GET /health
```
**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-19T10:30:00.000Z",
  "uptime": 12345.67
}
```

#### Authentication

##### Sign Up
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

##### Sign In
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

##### Sign Out
```http
POST /api/auth/sign-out
```

#### Users

##### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

##### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer {token}
```

##### Update User
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

##### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

### Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Database Management

### Drizzle ORM

The project uses Drizzle ORM for type-safe database operations.

#### Creating Models

```javascript
// src/models/example.model.js
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
```

#### Generating Migrations

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio for visual database management
npm run db:studio
```

### Database Operations

```javascript
// Example service using Drizzle
import { db } from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';

// Create
const newUser = await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: hashedPassword
}).returning();

// Read
const user = await db.select().from(users).where(eq(users.id, userId));

// Update
await db.update(users)
  .set({ name: 'Updated Name' })
  .where(eq(users.id, userId));

// Delete
await db.delete(users).where(eq(users.id, userId));
```

## Security

### Security Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Secure HTTP-only cookies
   - Role-based access control (RBAC)

2. **Password Security**
   - Bcrypt hashing with salt rounds
   - Password strength validation
   - Secure password reset flow

3. **API Security**
   - Helmet.js for security headers
   - CORS configuration
   - Rate limiting with Arcjet
   - Input validation with Zod

4. **Data Protection**
   - SQL injection prevention (parameterized queries)
   - XSS protection
   - CSRF protection
   - Environment variable encryption

### Security Best Practices

1. **Never commit sensitive data**:
   - Use `.env` files (git-ignored)
   - Store secrets in environment variables
   - Use GitHub Secrets for CI/CD

2. **Keep dependencies updated**:
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

3. **Use HTTPS in production**:
   - Configure SSL certificates
   - Redirect HTTP to HTTPS
   - Use secure cookies

4. **Monitor and log**:
   - Log security events
   - Monitor failed login attempts
   - Set up alerts for suspicious activity

##  Deployment

### Deployment Options

#### 1. Traditional VPS (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone and setup
git clone https://github.com/shirocodes/acquisitions.git
cd acquisitions
npm ci --production

# Start with PM2
pm2 start src/index.js --name acquisitions-api
pm2 save
pm2 startup
```

#### 2. Docker Deployment

```bash
# Pull from Docker Hub
docker pull yourusername/acquisitions:latest

# Run container
docker run -d \
  --name acquisitions-api \
  --restart unless-stopped \
  --env-file .env.production \
  -p 3000:3000 \
  yourusername/acquisitions:latest
```

#### 3. Kubernetes Deployment

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: acquisitions-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: acquisitions-api
  template:
    metadata:
      labels:
        app: acquisitions-api
    spec:
      containers:
      - name: api
        image: yourusername/acquisitions:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: acquisitions-secrets
```

#### 4. Platform-as-a-Service (PaaS)

**Heroku**:
```bash
heroku create acquisitions-api
heroku config:set NODE_ENV=production
git push heroku main
```

**Railway/Render**:
- Connect GitHub repository
- Configure environment variables
- Deploy automatically on push

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Logging to external service
- [ ] Health checks configured
- [ ] Auto-restart on failure

## 🔧 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

#### 2. **Database Connection Issues**
- Check `DATABASE_URL` format
- Verify database server is running
- Check network connectivity
- Ensure SSL mode matches database configuration

#### 3. **Docker Issues**
```bash
# Reset Docker
docker system prune -a
docker volume prune

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. **Node Modules Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 5. **Permission Errors**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Debug Mode

Enable debug logging:
```bash
# Set environment variable
DEBUG=* npm run dev

# Or in .env file
LOG_LEVEL=debug
```

### Getting Help

1. Check existing [GitHub Issues](https://github.com/shirocodes/acquisitions/issues)
2. Review logs in `logs/` directory
3. Enable debug mode for detailed output
4. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Environment details
   - Relevant logs

## Additional Resources

### Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Documentation](https://neon.tech/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)

### Tutorials
- [JWT Authentication Best Practices](https://jwt.io/introduction)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Docker for Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [GitHub Actions for Node.js](https://docs.github.com/actions/automating-builds-and-tests/building-and-testing-nodejs)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [TablePlus](https://tableplus.com/) - Database GUI
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - Container management
- [VS Code](https://code.visualstudio.com/) - Recommended IDE

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Please ensure:
- Code passes linting and formatting checks
- Tests pass and coverage is maintained
- Documentation is updated
- Commit messages follow conventional commits

##  Acknowledgments
- Inspired by JavaScript Mastery (JSM)
- Built with love using Node.js and Express
- Database powered by Neon and PostgreSQL
- Security enhanced with Arcjet
- Containerized with Docker
- CI/CD powered by GitHub Actions

---

**Happy Coding! **

For questions or support, please open an issue on [GitHub](https://github.com/shirocodes/acquisitions/issues).