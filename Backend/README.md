# AI Shiksha - Backend API Services

## Overview

This repository contains the backend architecture for the AI Shiksha Learning Management System. Developed using the NestJS framework, this project establishes a scalable, typed, and modular API capable of handling high-volume operational tasks such as media processing, secure transactions, user authentication, and third-party AI integrations.

## Technology Stack

### Core Frameworks
- **Framework:** NestJS (v11)
- **Language:** TypeScript
- **Runtime Environment:** Node.js

### Data Layer
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching & Queuing:** Redis
- **Data Validation:** Class Validator, Class Transformer

### Infrastructure & Integrations
- **Authentication:** Passport.js (Local and JWT strategies), bcrypt
- **Payments:** Stripe, Razorpay
- **Artificial Intelligence:** OpenAI API
- **Document Generation:** Puppeteer, pdf-lib, EJS
- **Email Services:** Nodemailer

## Core Features

- **Robust Authentication:** Secure JWT-based authentication system supporting role-based access control (RBAC) to enforce permissions across Admin, Instructor, and Student roles.
- **Enterprise Course Management:** Advanced relational data structures to manage categories, courses, curriculum modules, and individual lessons. Supports complex querying for course analytics.
- **Financial Processing:** Secure server-side processing for enrollments, integrated with Stripe and Razorpay webhook events to guarantee transactional integrity.
- **AI Service Bus:** A modularized implementation of OpenAI's APIs designed to assist instructors in scaffolding course structures and generating learning materials dynamically.
- **Automated Communication:** Scheduled and event-driven email dispatches using Nodemailer.
- **Certificate Generation:** Automated asynchronous generation of completion certificates utilizing Puppeteer and HTML/EJS templates.

## Directory Structure

```text
Backend/
├── prisma/                  # Prisma schema, migrations, and seeding scripts
├── src/                     # Core NestJS application
│   ├── modules/             # Segregated feature modules (Auth, Courses, Users, Payments)
│   ├── common/              # Shared guards, decorators, filters, and interceptors
│   ├── config/              # Centralized configuration management
│   └── main.ts              # Application bootstrap logic
├── test/                    # Integration and End-to-End configuration
├── uploads/                 # Local storage directory for media development testing
└── docker-compose.yml       # Container architecture for local database/redis setup
```

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Active local or remote connection)
- Redis Server (Required for session caching and job queues)

### Installation Steps

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file based on `.env.example`. Ensure the following minimum variables are supplied:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/lms_db?schema=public"
   JWT_SECRET="secure_cryptographic_random_string"
   STRIPE_SECRET_KEY="sk_test_your_key_here"
   OPENAI_API_KEY="sk-your_openai_key"
   FRONTEND_URL="http://localhost:8081"
   REDIS_URL="redis://localhost:6379"
   ```

4. Database Migration:
   Apply the current Prisma schema to your PostgreSQL instance:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate dev
   ```

5. Database Seeding (Optional):
   Populate the database with initial administrative accounts and foundational settings:
   ```bash
   npx prisma db seed
   ```

## Development and Build Scripts

- `npm run start:dev`: Bootstraps the application via nodemon/ts-node with hot reloading.
- `npm run build`: Compiles the application into the `dist/` folder via the Nest CLI.
- `npm run start:prod`: Runs the optimized production build (`node dist/main`).
- `npm run test`: Executes the Jest unit test suite.
- `npm run test:e2e`: Executes integration tests located in the `test/` directory.
- `npm run format`: Executes Prettier to format source files.
- `npm run lint`: Executes ESLint for code analysis.

## API Documentation

The application implements OpenAPI specification natively through NestJS Swagger.
When operating the server in a development environment, navigate to `http://localhost:3000/api` to interface directly with available endpoints, review data transfer objects (DTOs), and authenticate via JWT tokens.

## Contributing Standards

Any proposed structural changes or additions to the Prisma schema must be accompanied by appropriate DTO and service-layer updates. Execute `npm run format` and `npm run lint` before opening pull requests to maintain stylistic consistency. Consult the global `AI_GUIDELINES.md` for specific architectural rules.
