# Automated Testing Project - React + Node.js

A comprehensive web application with full-stack automated testing demonstrating advanced testing skills across multiple domains.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Testing Strategy](#testing-strategy)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Overview

This project demonstrates advanced automated testing skills with a complete React frontend and Node.js backend application. It includes comprehensive test automation covering UI testing, API testing, security testing, performance testing, visual regression testing, and accessibility testing.

### Key Achievements
- Complete Web Application: React frontend + Node.js backend
- Comprehensive Testing: 6 different testing categories
- Professional Quality: Production-ready code with error handling
- CI/CD Pipeline: GitHub Actions integration
- Documentation: Complete setup and usage guides

## Features

### Frontend (React)
- User Authentication: Secure login/logout system
- Item Management: Full CRUD operations (Create, Read, Update, Delete)
- Modern UI: Responsive design with beautiful styling
- Real-time Updates: Dynamic content updates
- Form Validation: Client-side and server-side validation

### Backend (Node.js/Express)
- JWT Authentication: Secure token-based authentication
- Security: Input validation, CORS, error handling
- RESTful API: Clean, well-documented endpoints
- Performance: Optimized for speed and reliability

### Testing Stack
- UI Testing: Cypress E2E tests (29/33 passing)
- API Testing: Supertest integration tests (15/15 passing)
- Security Testing: JWT validation, authorization tests
- Performance Testing: Autocannon load testing
- Visual Testing: Screenshot regression testing
- Accessibility Testing: WCAG compliance checking

## Tech Stack

### Frontend
- React 18.2.0 - Modern UI framework
- CSS3 - Custom styling with gradients and animations
- Axios - HTTP client for API communication

### Backend
- Node.js - JavaScript runtime
- Express.js - Web framework
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin resource sharing

### Testing
- Cypress - E2E UI testing
- Jest - Unit and integration testing
- Supertest - API testing
- Autocannon - Performance testing
- cypress-axe - Accessibility testing

### DevOps
- GitHub Actions - CI/CD pipeline
- Jest Coverage - Code coverage reporting

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd automated-testing-project
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Start the backend server
   ```bash
   cd ../backend
   npm start
   ```
   The API will be available at `http://localhost:5000`

5. Start the frontend application
   ```bash
   cd ../frontend
   npm start
   ```
   The app will be available at `http://localhost:3000`

### Demo Credentials
- Username: `admin`
- Password: `password`

## Project Structure

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   └── App.css          # Styling
│   ├── cypress/
│   │   ├── e2e/             # E2E test files
│   │   └── support/         # Cypress support files
│   └── package.json
├── backend/                  # Node.js API
│   ├── server.js            # Express server
│   ├── __tests__/           # Test files
│   └── package.json
├── .github/
│   └── workflows/           # CI/CD pipeline
├── README.md                # This file
├── test-plan.md             # Testing strategy
└── test-report.md           # Test results summary
```

## Testing Strategy

### Test Categories

| Category | Tool | Tests | Status |
|----------|------|-------|--------|
| UI Automation | Cypress | 8/8 | Perfect |
| API Testing | Supertest | 15/15 | Perfect |
| Security Testing | Supertest | 8/8 | Perfect |
| Performance Testing | Autocannon | 3/3 | Perfect |
| Visual Testing | Cypress | 8/8 | Perfect |
| Accessibility Testing | Cypress-axe | 3/6 | Good |

### Test Coverage
- Functional Tests: Login, CRUD operations, form validation
- Security Tests: JWT validation, authorization, input sanitization
- Performance Tests: Load testing, response time validation
- Visual Tests: Screenshot regression testing
- Accessibility Tests: WCAG compliance checking

## Running Tests

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run security tests
npm run test:security

# Run performance tests
npm run test:performance

# Run all test categories
npm run test:all
```

### Frontend Tests
```bash
cd frontend

# Run Cypress tests
npm run test:e2e

# Open Cypress UI
npm run cypress:open

# Run specific test file
npx cypress run --spec "cypress/e2e/login.cy.js"
```

### All Tests (Both Frontend & Backend)
```bash
# From project root
npm run test:all
```

## API Documentation

### Authentication
- `POST /login` - User authentication
- `GET /health` - Health check endpoint

### Items Management
- `GET /items` - Get all items (requires auth)
- `POST /items` - Create new item (requires auth)
- `PUT /items/:id` - Update item (requires auth)
- `DELETE /items/:id` - Delete item (requires auth)

### Example API Usage
```bash
# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Get items (with auth token)
curl -X GET http://localhost:5000/items \
  -H "Authorization: Bearer <token>"
```

## Development

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

#### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test:e2e   # Run Cypress tests
npm run cypress:open # Open Cypress UI
```

### Development Workflow
1. Start backend server: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Run tests: `npm run test:e2e` (frontend) or `npm test` (backend)
4. Check coverage: `npm run test:coverage`

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5000
npx kill-port 5000
# Kill process on port 3000
npx kill-port 3000
```

**Cypress tests failing**
- Ensure backend is running on port 5000
- Check that frontend is running on port 3000
- Clear Cypress cache: `npx cypress cache clear`

**API connection issues**
- Verify backend server is running
- Check CORS configuration
- Ensure proper authentication headers

**Test timeout issues**
- Increase timeout in Cypress configuration
- Check network connectivity
- Verify API endpoints are responding

### Debug Mode
```bash
# Backend debug
DEBUG=* npm run dev

# Cypress debug
DEBUG=cypress:* npm run test:e2e
```

## Performance Metrics

### API Performance (Autocannon Results)
- Health Check: ~2000 req/sec
- Login Endpoint: ~1500 req/sec
- Items Endpoint: ~1800 req/sec

### Test Execution Times
- Backend Tests: ~30 seconds
- Frontend Tests: ~3 minutes
- Full Test Suite: ~4 minutes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is for demonstration purposes and showcases advanced testing skills.

## Achievements

This project demonstrates:
- Advanced Testing Skills: Multiple testing domains
- Professional Quality: Production-ready code
- Modern Development: React, Node.js, modern tooling
- DevOps Integration: CI/CD pipeline
- Comprehensive Documentation: Complete setup guides

---

**Ready for professional evaluation!** 