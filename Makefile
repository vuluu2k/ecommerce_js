.PHONY: build run dev stop clean docker-build docker-run docker-stop

# Default target
all: dev

# Install dependencies
install:
	npm install

# Development mode
dev: install
	NODE_ENV=dev npm start

# Production mode
prod: install
	NODE_ENV=prod npm start

# Build Docker image
docker-build:
	docker build -t ecommerce-js .

# Run with Docker
docker-run: docker-build
	docker-compose up

# Stop Docker containers
docker-stop:
	docker-compose down

# Clean up
clean:
	rm -rf node_modules
	docker system prune -f

# Help command
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev       - Run in development mode"
	@echo "  make prod      - Run in production mode"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run with Docker"
	@echo "  make docker-stop  - Stop Docker containers"
	@echo "  make clean     - Clean up dependencies and Docker resources"
	@echo "  make help      - Show this help message"