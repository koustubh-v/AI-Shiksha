# AI Shiksha - Advanced Learning Management System

## Overview

AI Shiksha is a comprehensive, enterprise-grade Learning Management System (LMS) enhanced with Artificial Intelligence. The platform is designed to facilitate seamless course creation, robust student engagement, and advanced analytics for modern educational institutions and independent instructors. The project follows a monorepo architecture, dividing the application into a scalable backend API and a highly responsive frontend client.

## System Architecture

The project consists of two primary applications:

1. **Frontend Client:** A Single Page Application (SPA) built with React and Vite, utilizing Tailwind CSS and Shadcn UI for a responsive, modern interface.
2. **Backend API:** A RESTful API built on the NestJS framework, utilizing PostgreSQL as the primary data store, integrated with Prisma ORM for type-safe database access, and Redis for caching and queuing.

## Repository Structure

```text
AI-Shiksha/
├── Backend/                 # NestJS API Server
│   ├── prisma/              # Database schemas and migrations
│   ├── src/                 # Application source code
│   └── test/                # E2E and integration tests
├── Frontend/                # React Client Application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Application views and routing
│   │   └── lib/             # Utility functions and API clients
├── AI_GUIDELINES.md         # Instructions for AI coding assistants
└── README.md                # Global documentation (This file)
```

## Quick Start

### 1. Database and Environment Setup
Ensure you have PostgreSQL and Node.js v18+ installed on your system.
You will need to configure environment variables for both the Backend and Frontend. Navigate to their respective directories and copy the `.env.example` configurations to `.env`.

### 2. Backend Initialization
Navigate to the backend directory, install dependencies, configure the database, and start the development server.

```bash
cd Backend
npm install
npm run prisma:generate
npm run prisma:migrate deploy
npm run start:dev
```
The API will be available at `http://localhost:3000`.

### 3. Frontend Initialization
In a new terminal session, navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd Frontend
npm install
npm run dev
```
The application will launch at `http://localhost:8081`.

## Documentation Reference

For detailed installation instructions, architecture decisions, and configuration guides, please consult the dedicated documentation files:

- **[Backend Documentation](./Backend/README.md)**
- **[Frontend Documentation](./Frontend/README.md)**
- **[AI Guidelines](./AI_GUIDELINES.md)** (Critical reading for contributors using AI assistants)

## Key Features

- **Role-Based Access Control (RBAC):** Specialized dashboards and permissions for Administrators, Instructors, and Students.
- **AI-Powered Course Builder:** Curriculum design assisted by OpenAI, allowing for rapid generation of course structures, lesson outlines, and quizzes.
- **Advanced Learning Interface:** Support for various content types including distraction-free video playback, rich text articles, interactive quizzes, and file assignments.
- **Payment Processing:** Integrated handling for subscriptions and one-time purchases via Stripe and Razorpay.
- **Comprehensive Analytics:** Real-time tracking of student progress, course engagement, and financial metrics.

## Contributing

We welcome contributions to AI Shiksha. All prospective contributors must adhere to the project's coding standards. If you are utilizing AI coding assistants (such as GitHub Copilot, Cursor, etc.), ensure you strictly follow the rules outlined in `AI_GUIDELINES.md` to maintain code consistency and quality.

## License

This project is proprietary and unlicensed. Unauthorized copying of this project, via any medium, is strictly prohibited.
