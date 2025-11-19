# 📚 Kindle Backend API

A modern, high-performance backend API for the Kindle application built with **Bun**, Express.js, MongoDB, and TypeScript support.

## 🚀 Features

- **⚡ Bun Runtime** - Ultra-fast JavaScript runtime with built-in bundler, test runner, and package manager
- **🔷 TypeScript Ready** - Full TypeScript support out of the box
- **🛡️ Security First** - Helmet, rate limiting, input validation
- **🔐 Authentication** - JWT-based auth with refresh tokens
- **🗄️ Database** - MongoDB with Mongoose ODM
- **✅ Validation** - Express-validator for input validation
- **🎯 Error Handling** - Centralized error handling
- **📊 Logging** - Structured logging with different levels
- **📤 File Uploads** - Secure file upload handling
- **🔄 API Versioning** - Versioned API endpoints
- **❤️ Health Checks** - Built-in health monitoring
- **🐳 Docker Support** - Complete containerization setup
- **🛠️ Development Tools** - ESLint, Prettier, Hot reloading

## 🛠️ Tech Stack

- **Runtime:** Bun 1.0+
- **Framework:** Express.js 4.18+
- **Language:** JavaScript/TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express-validator
- **Security:** Helmet, CORS, Rate Limiting
- **Development:** Bun's built-in tools, ESLint, Prettier
- **Containerization:** Docker & Docker Compose

## 📋 Prerequisites

- Bun 1.0.0 or higher
- MongoDB 5.0 or higher

## 🏃‍♂️ Quick Start

### 1. Install Bun (if not installed)

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Clone and Install

```bash
cd backend
cp .env.example .env
bun install
```

### 3. Environment Setup

Edit `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
DB_URI=mongodb://localhost:27017/kindle_db
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### 4. Start Development Server

```bash
# Start with hot reloading (recommended for development)
bun run dev

# Or start normally
bun start

# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

### 4. Using Docker (Alternative)

```bash
# Start all services (MongoDB + Redis + API)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

## 📁 Project Structure

```
backend/
├── config/           # Configuration management
├── db/              # Database connection
├── middleware/      # Custom middleware
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # File uploads directory
├── .env.example     # Environment variables template
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── index.js         # Application entry point
└── package.json
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - API health status

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### Books
- `GET /api/v1/books` - Get all books
- `GET /api/v1/books/:id` - Get book by ID
- `POST /api/v1/books` - Create new book (auth required)
- `PUT /api/v1/books/:id` - Update book (auth required)
- `DELETE /api/v1/books/:id` - Delete book (auth required)

### File Uploads
- `GET /uploads/:filename` - Serve uploaded files

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevent DoS attacks
- **CORS** - Cross-origin request handling
- **Input Validation** - Request validation
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Error Sanitization** - Safe error responses

## 🧪 Development

### Available Scripts

```bash
bun start        # Start production server
bun run dev      # Start development server with hot reloading
bun test         # Run tests with Bun's built-in test runner
bun test --watch # Run tests in watch mode
bun run lint     # Run ESLint
bun run lint:fix # Fix ESLint issues
bun run format   # Format code with Prettier
bun run build    # Build for production
bun install      # Install dependencies
```

### Why Bun?

Bun offers several advantages over Node.js:

- **⚡ 4x faster** startup and execution times
- **📦 Built-in bundler** - No need for Webpack/Rollup
- **🧪 Native test runner** - No need for Jest
- **📄 TypeScript support** - No compilation step needed
- **⚡ Fast package manager** - Replaces npm/yarn
- **🔥 Hot reloading** - Built-in file watching
- **📝 Better APIs** - Modern, intuitive APIs

### Code Quality

The project uses ESLint and Prettier for code quality:

```bash
# Check code style
bun run lint

# Auto-fix issues
bun run lint:fix

# Format code
bun run format
```

## 🐳 Docker

### Development with Docker

```bash
# Start all services with Bun
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up --build

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build production image with Bun
docker build --target production -t kindle-backend:latest .

# Run production container
docker run -d \
  --name kindle-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e DB_URI=your-mongodb-uri \
  kindle-backend:latest
```

## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | development | No |
| `PORT` | Server port | 5000 | No |
| `HOST` | Server host | localhost | No |
| `DB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes (prod) |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | Yes (prod) |
| `ALLOWED_ORIGINS` | CORS allowed origins | - | No |

## 📊 Monitoring

### Health Check

Check API health:

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### Logs

The application uses structured logging:

- **Development:** Human-readable console output
- **Production:** JSON format for log aggregation

## 🚀 Deployment

### Using Docker

1. Build production image:
```bash
docker build --target production -t kindle-backend .
```

2. Deploy with environment variables:
```bash
docker run -d \
  --name kindle-backend \
  -p 5000:5000 \
  --env-file .env.production \
  kindle-backend
```

### Using Bun

1. Install dependencies:
```bash
bun install --production
```

2. Start with PM2:
```bash
pm2 start index.js --name kindle-backend --interpreter bun
```

## 🧪 Testing

Bun provides a built-in, fast test runner:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run with coverage
bun test --coverage

# Run specific test file
bun test app.test.js
```

Test files use Bun's native test API:

```javascript
import { test, expect, describe } from 'bun:test';

describe('API Tests', () => {
  test('should work', () => {
    expect(1 + 1).toBe(2);
  });
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Made with ⚡ Bun and ❤️ for ultra-fast backend development**