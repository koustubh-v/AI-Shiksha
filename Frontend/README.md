# AI Shiksha - Frontend Application

## Overview

This repository contains the client-side application for the AI Shiksha Learning Management System (LMS). Built with a focus on delivering a high-performance, responsive, and visually sophisticated user experience, this frontend leverages modern web technologies to handle complex state management, data fetching, and rich media presentation.

## Technology Stack

### Core Frameworks
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript

### Styling & UI
- **CSS Framework:** Tailwind CSS
- **UI Component Library:** Shadcn UI (Built on Radix UI primitives)
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Architecture & Utilities
- **State Management & Data Fetching:** TanStack React Query v5, Axios
- **Form Management & Validation:** React Hook Form, Zod
- **Routing:** React Router DOM (v6 object-based routing)
- **Rich Text Editor:** TipTap Editor
- **PDF Generation:** react-pdf, html2pdf.js

## Core Features

- **Role-Based Interfaces:** Distinct dashboard experiences optimized for Administrators, Instructors, and Students.
- **Dynamic Course Builder:** A sophisticated drag-and-drop interface prioritizing ease of curriculum creation, incorporating rich text formatting, media uploads, and AI prompt integrations.
- **Immersive Learning Environment:** A custom video player layout, dynamic progress tracking, and distraction-free learning interfaces for maximum student retention.
- **Authentication & Security:** Secure JWT handling, robust password recovery flows, and protected route wrappers.
- **Premium Design System:** Strict adherence to modern glassmorphic design principles, fluid typography, dark and light theme toggling, and comprehensive mobile responsiveness.

## Directory Structure

```text
src/
├── assets/          # Static assets (images, vectors, fonts)
├── components/      # Modular, reusable UI components
│   ├── ui/          # Low-level Shadcn UI physical components
│   ├── layout/      # Structural layout wrappers (Sidebars, Navigations)
│   ├── forms/       # Standardized form elements
│   └── shared/      # Components shared across multiple domain areas
├── hooks/           # Custom React hooks for business logic and UI state
├── lib/             # Utility functions, constants, and API configuration
├── pages/           # Top-level route components mapped to the application URL
│   ├── admin/       # Administrator views
│   ├── dashboard/   # Instructor and Student portal views
│   └── public/      # Unauthenticated landing pages and flows
├── types/           # Global TypeScript type definitions and interfaces
└── App.tsx          # Application entry point and router configuration
```

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation Steps

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file in the root of the Frontend directory. Use the following as a template:
   ```env
   VITE_API_URL="http://localhost:3000"
   VITE_STRIPE_PUBLIC_KEY="pk_test_your_key_here"
   # Add any custom third-party integrations here
   ```

## Development and Build Scripts

The `package.json` file contains several commands for development lifecycle management:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles the TypeScript code and produces an optimized production bundle.
- `npm run build:dev`: Compiles the application in development mode for debugging build issues.
- `npm run preview`: Bootstraps a local web server to preview the production build.
- `npm run lint`: Executes ESLint to check for code quality and style violations.
- `npm run test`: Runs the Vitest test suite.
- `npm run test:watch`: Runs tests in watch mode for active development.

## Contributing Standards

Before committing code, ensure all local linters and TypeScript builds pass without errors. Do not commit unused code, console logs, or mock data to production branches. Refer to the global `AI_GUIDELINES.md` for specific architectural patterns and AI assistance rules.
