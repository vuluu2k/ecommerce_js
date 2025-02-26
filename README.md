# E-commerce JS

A modern e-commerce backend built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- MongoDB database with Mongoose ODM
- Authentication and Authorization
- Product management
- Shop management
- Error handling
- API key management
- Docker support

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for local development)
- Docker and Docker Compose (for containerized deployment)

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecommerce_js.git
   cd ecommerce_js
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Start the development server:
   ```bash
   make dev
   ```

### Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   make docker-run
   ```

2. Stop Docker containers:
   ```bash
   make docker-stop
   ```

## Available Commands

- `make install` - Install project dependencies
- `make dev` - Run in development mode
- `make prod` - Run in production mode
- `make docker-build` - Build Docker image
- `make docker-run` - Run with Docker Compose
- `make docker-stop` - Stop Docker containers
- `make clean` - Clean up dependencies and Docker resources
- `make help` - Show available commands

## Environment Variables

### Development
- `DEV_APP_PORT` - Application port (default: 3000)
- `DEV_DB_HOST` - MongoDB host (default: localhost)
- `DEV_DB_PORT` - MongoDB port (default: 27017)
- `DEV_DB_NAME` - Database name (default: ecommerce)

### Production
- `PROD_APP_PORT` - Application port (default: 3000)
- `PROD_DB_HOST` - MongoDB host (default: localhost)
- `PROD_DB_PORT` - MongoDB port (default: 27017)
- `PROD_DB_NAME` - Database name (default: ecommerce)

## Project Structure

```
├── src/
│   ├── app.js           # Express app setup
│   ├── auth/            # Authentication logic
│   ├── configs/         # Configuration files
│   ├── controllers/     # Route controllers
│   ├── core/            # Core functionality
│   ├── dbs/            # Database setup
│   ├── helpers/         # Helper functions
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── docker-compose.yml   # Docker Compose config
├── Dockerfile          # Docker build instructions
└── Makefile            # Build automation
```

## License

ISC License