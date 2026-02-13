# AI Shiksha - Frontend (LMS Client)

This is the modern, responsive frontend application for the AI Shiksha Learning Management System. Built with **React** and **Vite**, it offers a premium user experience with a focus on performance, aesthetics, and usability.

## 🛠 Tech Stack

*   **Builder:** [Vite](https://vitejs.dev/) - Super fast build tool.
*   **Framework:** [React](https://react.dev/) (v18)
*   **Language:** TypeScript
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:**
    *   [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
    *   [Lucide React](https://lucide.dev/) (Icons)
*   **State Management:** React Hooks & Context API
*   **Forms:** React Hook Form + Zod Validation
*   **Data Fetching:** Axios / TanStack Query (React Query)
*   **Routing:** React Router DOM

## 🚀 Key Features

*   **Modern Dashboard:**
    *   Role-specific dashboards (Admin, Instructor, Student).
    *   Analytics with interactive charts (Recharts).
*   **Course Builder:**
    *   Drag-and-drop curriculum builder.
    *   Rich text editing for lesson content.
    *   Multi-modal creation flow (Wizard, Modals).
*   **Learning Experience:**
    *   Distraction-free video player.
    *   real-time progress tracking.
    *   Quiz and Assignment interfaces.
*   **Authentication Flow:**
    *   Login, Registration, and Password Recovery.
    *   Protected routes based on user roles.
*   **Design System:**
    *   Fully responsive layout (Mobile, Tablet, Desktop).
    *   Dark/Light mode support.
    *   Glassmorphism and modern UI trends.

## ⚙️ Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/koustubh-v/AI-Shiksha.git
    cd Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the `Frontend` root directory:
    ```env
    VITE_API_URL="http://localhost:3000"
    VITE_STRIPE_PUBLIC_KEY="pk_test_..."
    ```

## 🏃‍♂️ Running the Application

*   **Development Mode:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8081` (or the port shown in your terminal).

*   **Production Build:**
    ```bash
    npm run build
    npm run preview
    ```

## 📂 Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── ui/          # Shadcn UI primitives
│   ├── layout/      # Layout wrappers (Sidebar, Navbar)
│   └── ...
├── hooks/           # Custom React hooks
├── lib/             # Utilities (API client, helpers)
├── pages/           # Page views (Routed components)
│   ├── admin/       # Admin-specific pages
│   ├── dashboard/   # Instructor/Student dashboard
│   └── ...
├── types/           # TypeScript interfaces/types
└── App.tsx          # Main application entry
```

## 🤝 Contributing

We welcome contributions! Please ensure you lint your code before submitting a Pull Request.

```bash
# Lint code
npm run lint
```
