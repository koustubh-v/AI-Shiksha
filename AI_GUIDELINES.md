# AI Shiksha - Guidelines for AI Coding Assistants

## Purpose

This document contains standardized guidelines and context intended primarily for Artificial Intelligence coding assistants (such as GitHub Copilot, Cursor, absolute/system prompts, etc.) operating within this repository. 

AI Agents **must** abide by these rules, architectural constraints, and formatting requirements when generating code, updating documentation, or refactoring elements within the `AI-Shiksha` monorepo.

## 1. System Architecture Context

The repository is divided into two decoupled monolithic applications:
- **Frontend:** A React 18 SPA built with Vite, TypeScript, and Tailwind CSS.
- **Backend:** A Node.js API built with NestJS (v11), TypeScript, PostgreSQL, and Prisma.

Communication between the two occurs via RESTful API endpoints. Avoid tightly coupling the frontend logic directly to the database or backend implementations. Ensure cross-origin resource sharing (CORS) rules and JWT authorizations are respected.

## 2. Professionalism and Tone

- **No Emojis:** Do not use emojis in documentation, commit messages, console logs, UI toast notifications, or README files.
- **Professional Language:** Maintain a strictly professional, technical, and objective tone in all written text (comments, documentation, user-facing error messages). Do not use colloquialisms.

## 3. General Development Rules

- **Franchise Isolation:** Maintain strict franchise isolation while implementing changes. Ensure that new modifications do not affect the current deployed system or cross franchise boundaries.
- **Clean Code:** Do not add unwanted comments or logs in the codebase. Avoid leaving debug `console.log` statements in finalized code. Use appropriate structured logging (e.g., NestJS Logger) only when necessary in the backend.
- **Type Safety First:** This codebase strictly utilizes TypeScript. Never use `any` unless absolutely necessary (e.g., interfacing with poorly typed third-party legacy libraries). Define exhaustive interfaces and types in their respective definition files or DTOs.
- **Readability Over Cleverness:** Write code that is instantly understandable by intermediate developers. Avoid overly dense one-liners if a multi-line implementation is more legible.

## 4. Backend Rules (NestJS)

- **Modularity:** Adhere to the NestJS modular architecture. Every distinct domain (e.g., Users, Courses, Payments) must have its own `.module.ts`, `.controller.ts`, and `.service.ts`.
- **Dependency Injection:** Strictly rely on dependency injection for services. Never instantiate services via the `new` keyword within controllers or other services.
- **Data Transfer Objects (DTOs):** All incoming HTTP request bodies must be validated using `class-validator` decorators inside DTO classes. Do not parse raw `req.body`.
- **Database Access:** All database operations must flow through the `PrismaService`. Do not write raw SQL queries unless attempting highly optimized bulk operations that Prisma cannot fulfill.
- **Error Handling:** Use built-in NestJS `HttpException` classes (e.g., `NotFoundException`, `BadRequestException`). Never return custom error objects that deviate from the standard JSON payload structure created by NestJS's exception filters.
- **Environment Variables:** All configuration must be sourced via `@nestjs/config` using a `ConfigService`. Do not access `process.env` directly within services.

## 5. Frontend Rules (React + Vite)

- **Component Design:** Components must be functionally pure, deterministic, and modular. Separate business logic (custom hooks) from presentation (JSX).
- **Styling:** Utilize Tailwind CSS for all styling. Avoid creating custom CSS files unless attempting highly specific animations or overrides that Tailwind cannot manage natively.
- **UI Consistency:** Rely exclusively on the Shadcn UI component library situated in `src/components/ui`. Do not introduce secondary component libraries or build native HTML inputs unless wrapping them in accessible Radix primitives.
- **State Management:** Use `TanStack React Query` for server state (data fetching, mutations, caching). Only use React Context for truly global client state (e.g., theme, authentication status). Avoid complex local `useState` implementations for data that originates from an API.
- **Routing:** Use React Router DOM object configuration. Protect authenticated routes using a layout or wrapper component that checks the user role against the required permissions.

## 6. Testing Expectations

- Ensure code passes the existing linter rules (`npm run lint`).
- When writing tests (Vitest for Frontend, Jest for Backend), focus on behavioral testing rather than implementation details. Ensure edge cases and error states are asserted alongside the happy path.

## 7. Documentation Requirements

- Document complex algorithms, non-obvious business logic, and third-party workarounds with JSDoc style block comments.
- Do not add comments describing obvious implementation details (e.g., do not comment `// increment counter by 1` above `counter++`).
- When introducing new API endpoints, they must be fully documented using `@nestjs/swagger` decorators on the controller methods and corresponding DTOs.

By adhering to these rules, you maintain the robust, typed, and professional architecture of the AI Shiksha platform.
