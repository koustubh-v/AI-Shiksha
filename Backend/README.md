# AI Shiksha - Backend (LMS API)

This is the robust backend API for the AI Shiksha Learning Management System (LMS), built with **NestJS**. It provides a scalable, secure, and feature-rich foundation for course management, user authentication, enrollment handling, and AI-powered features.

## 🛠 Tech Stack

*   **Framework:** [NestJS](https://nestjs.com/) (v11)
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** Passport.js (JWT Strategy)
*   **Payments:** Stripe Integration
*   **AI Integration:** OpenAI API (for course generation/assistance)
*   **Documentation:** Swagger / OpenAPI
*   **Testing:** Jest

## 🚀 Key Features

*   **Authentication & Authorization:**
    *   Secure JWT-based authentication.
    *   Role-Based Access Control (RBAC): Admin, Instructor, Student.
*   **Course Management:**
    *   CRUD operations for courses, modules, and lessons.
    *   Advanced Course Builder support (Drafts, Publishing, Analytics).
    *   Media management (Video, Thumbnails).
*   **Enrollment System:**
    *   Student enrollment tracking.
    *   Progress monitoring (Course & Lesson completion).
*   **eCommerce:**
    *   Stripe payment gateway integration.
    *   Order processing and webhooks.
*   **AI Features:**
    *   AI-assisted content generation for lessons and quizzes.
*   **Admin Dashboard:**
    *   Analytics and reporting endpoints.
    *   User and content moderation.

## ⚙️ Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   PostgreSQL Database
*   Redis (Optional, for caching/queues)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/koustubh-v/AI-Shiksha.git
    cd Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the `Backend` root directory. Use `.env.example` as a reference:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/lms_db?schema=public"
    JWT_SECRET="your_super_secret_key"
    STRIPE_SECRET_KEY="sk_test_..."
    OPENAI_API_KEY="sk-..."
    FRONTEND_URL="http://localhost:5173"
    ```

4.  **Database Setup:**
    ```bash
    # Generate Prisma Client
    npm run prisma:generate

    # Run Migrations
    npm run prisma:migrate

    # (Optional) Seed the database with initial data
    npm run prisma:seed
    ```

## 🏃‍♂️ Running the Application

*   **Development Mode:**
    ```bash
    npm run start:dev
    ```
    The server will start on `http://localhost:3000` (default).

*   **Production Build:**
    ```bash
    npm run build
    npm run start:prod
    ```

## 📚 API Documentation

Once the server is running, you can access the interactive Swagger API documentation at:

```
http://localhost:3000/api
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
